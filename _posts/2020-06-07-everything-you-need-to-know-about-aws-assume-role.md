---
layout: post
title: "Everything you need to know about AWS assume role"
tags: [AWS, AWS STS]
---

In this article, I will discuss the AWS assume role mechanism. Hopefully, you can understand it for every single details.
#### Brief Introduction
I will start with a YouTube video:
<div class="row">
  <div class="col">
	<div class="embed-responsive embed-responsive-4by3">
		<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/C2jJ8ZvDkL0?rel=0" allowfullscreen></iframe>
	</div>
  </div>
</div>

An IAM role is an IAM identity that you can create in your account that has specific permissions. An IAM role is similar to an IAM user, in that it is an AWS identity with permission policies that determine what the identity can and cannot do in AWS. [^1] 

#### Why IAM Role?
IAM role usually can be used to grant permissions to IAM users in other account. So, why not just create a policy with [principals](https://docs.aws.amazon.com/AmazonS3/latest/dev/s3-bucket-user-policy-specifying-principal-intro.html) specified as other IAM users? Well, the best advantage of IAM role is that **it does not have standard long-term credentials such as a password or access keys associated with it**. Undoubtedly, one of the biggest pain is credential rotation to prevent leaking issue. Using IAM role, instead, can help us completely get rid of this nightmare. 

#### Trusted Entity
As the video mentioned above, when we create a IAM role, we can selete the type of trusted entity. And there're 4 types in general: AWS services, Another AWS account, Web identity and SAML 2.0 federation. Here, let's focus on the first 2 types as they're commonly used in our daily life:
##### EC2
For EC2 instance, we can attach an IAM role to it. Once it's done, the security credentials provided by the role will be saved in the instance metadata item `iam/security-credentials/role-name`. One of the greatest advantages is that these security credentials are temporary and EC2 will rotate them automatically. [^2] In AWS SDK, for example, Java, we can fetch the credentials using the [InstanceProfileCredentialsProvider](https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/index.html?com/amazonaws/auth/InstanceProfileCredentialsProvider.html). 

###### Sample Java Code:
```java
AmazonS3 s3 = AmazonS3ClientBuilder.standard()
              .withCredentials(new InstanceProfileCredentialsProvider(false))
              .build();
```

##### Other AWS Accounts
Once we added other AWS account (say account B) as the trusted entity, we need to grant `sts:AssumeRole` permission for its IAM users to assume the role. Sample policy is:

###### Sample IAM User Assume Role Policy:
```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::ACCOUNT-A-ID:role/RoleName"
  }
}
```
#### RDS IAM Role Auth
Yes, AWS RDS supports IAM auth with a specific DB user. To set up IAM database authentication using IAM roles, we need to do the following steps [^3]:
1. Enable IAM DB authentication on the RDS DB instance.
<img src="/assets/images/aws_rds_enable_iam_auth.png" width="80%"/>
2. Create a database user account that uses an AWS authentication token.
```shell
psql -d postgres -c "CREATE USER db_user WITH LOGIN"
psql -d postgres -c "GRANT rds_iam TO db_user"
```
Meanwhile, make sure the `db_user` has proper privileges on all tables or sequences:
```shell
psql -d <DB> -c "GRANT ALL ON ALL TABLES IN SCHEMA public TO db_user"
psql -d <DB> -c "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO db_user"
```
And make sure the commands above been executed successfully:
```sql
postgres=> \du
                                                    List of roles
     Role name     |                         Attributes                         |              Member of
-------------------+------------------------------------------------------------+-------------------------------------
 db_user           |                                                            | {rds_iam}
 rds_iam           | Cannot login                                               | {}
 rds_replication   | Cannot login                                               | {}
 rds_superuser     | Cannot login                                               | {rds_replication,pg_signal_backend}
 rdsadmin          | Superuser, Create role, Create DB, Replication, Bypass RLS+| {}
                   | Password valid until infinity                              |
```
```sql
postgres=> SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name='<table_name_the_db_user_wants_to_access>';
      grantee      | privilege_type
-------------------+----------------
 db_user           | INSERT
 db_user           | SELECT
 db_user           | UPDATE
 db_user           | DELETE
 db_user           | TRUNCATE
 db_user           | REFERENCES
 db_user           | TRIGGER
(7 rows)
```
3. Add an IAM policy that maps the database user to the IAM role.
```json
{
  "Version": "2012-10-17",
  "Statement": [
      {
        "Effect": "Allow",
        "Resource": [
          "arn:aws:rds-db:<AWS_REGION>:<AWS_ACCOUNT>:dbuser:cluster-<RDS_CLUSTER_ID>/db_user"
        ],
        "Action": [
        "rds-db:connect"
        ]
      }
  ]
}
```
4. Attach the IAM role to the EC2 instance.
5. Generate an AWS authentication token to identify the IAM role.
##### PostgreSQL
```shell
export
PGPASSWORD="$(aws rds generate-db-auth-token
--hostname={db endpoint} --port=5432
--username={db user} --region us-west-2)"
```
##### MySQL
```shell
$ aws rds generate-db-auth-token --hostname {db or cluster endpoint} --port 3306 --username {db username}
```
6. Download the SSL root certificate file or certificate bundle file.
7. Connect to the RDS DB instance using IAM role credentials and the authentication token or an SSL certificate.

to be continued...

[^1]: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
[^2]: [IAM roles for Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)
[^3]: [How do I allow users to connect to an Amazon RDS MySQL DB instance using their IAM credentials?](https://aws.amazon.com/premiumsupport/knowledge-center/users-connect-rds-iam/)
