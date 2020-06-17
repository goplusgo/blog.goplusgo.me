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

to be continued...

[^1]: [IAM Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
[^2]: [IAM roles for Amazon EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html)

