---
layout: post
title: "GitLab Traps and Pitfalls"
tags: [GitLab]
---

Listed several pitfalls in GitLab that might be troublesome in developers' daily life:
#### 1. Resource Leak While Cancelling Job
Each GitLab job can have `script` and `after_script` blocks. Normally, we prepare resources and do the job execution in the `script` block and cleanup or recycle the resources in the `after_script` block. 
```yaml
job:
  before_script:
    - prepare resouces and requisites
  script:
    - job commands
  after_script:
    - cleanup/recycle resources
``` 
This works well in most scenarios. However, when we manually cancel the job, the `after_script` block won't get executed. Resources allocated in the `script` block might be hanging around there permanently. 

Apparently, GitLab hasn't yet adopted the philosophy of Java exception handling: In Java, whenver an exception happened, we have the `finally` block that can be used to take care of resources leak. 

Of cause, lots of developers are long for this feature, see [Ensure after_script is called for cancelled and timed out pipelines](https://gitlab.com/gitlab-org/gitlab/-/issues/15603).

#### 2. Artifacts Might Be Gone
[GitLab artifacts](https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html) are a list of files and directories created by a job once it finishes. It acted like the shared folder between stages. Sometimes, we need to save some info in the artifacts from the previous stage and would like to read those info in the next stage. For instance, we have a stage called `install` where we provision EC2 instance and install our system. 

```yaml
install:
  script:
    set up EC2 instance and install system
  artifacts:
    paths:
    - instance_ip.txt
```

And we would like to export its instance IP so that the next `smoketest` stage can know the endpoint to connect to:

```yaml
smoketest:
  script:
    - INSTANCE_IP=cat instance_ip.txt
    - connect to INSTANCE_IP and run smoke test against to
```

However, by default, the artifacts will be passed to the next stage. We need to manually specify the previous stage/job as a dependency in the next stage/job, see this [stackoverflow post](https://stackoverflow.com/questions/38140996/how-can-i-pass-artifacts-to-another-stage). In other words, we need to modify the `smoketest` job as:

```yaml
smoketest:
  script:
    - INSTANCE_IP=cat instance_ip.txt
    - connect to INSTANCE_IP and run smoke test against to
  dependencies:
    - install
```

#### 3. Retry Manual Job Won't Take Input Variables
In GitLab, we can define the manual job in our CI/CD pipeline. And those manual jobs can take custom defined variables from input:
<img src="/assets/images/gitlab_manual_job.png" width="80%"/>

However, when you retry the manual job, the variables won't take effects. Resolution is still on the way, see [Specify variables when retrying a manual job](https://gitlab.com/gitlab-org/gitlab/-/issues/37268).



