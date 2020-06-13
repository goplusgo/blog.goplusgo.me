---
layout: post
title: "Pitfalls in GitLab"
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
[GitLab artifacts](https://docs.gitlab.com/ee/ci/pipelines/job_artifacts.html) are a list of files and directories created by a job once it finishes. It acted like the shared folder between stages. Sometimes, we need to save some info in the artifacts from the previous stage and would like to read those info in the next stage. However, by default, the artifacts will be passed to the next stage. 

We need to manually specify the previous stage/job as a dependency in the next stage/job, see this [stackoverflow post](https://stackoverflow.com/questions/38140996/how-can-i-pass-artifacts-to-another-stage).

to be continued...
