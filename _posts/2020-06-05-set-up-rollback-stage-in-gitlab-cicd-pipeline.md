---
layout: post
title: "Set up rollback stage in GitLab CI/CD pipeline"
summary: 
tags: [GitLab, CI/CD, Deployment]
---

##### What's GitLab?
GitLab is a web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking and continuous integration/continuous deployment pipeline features, using an open-source license, developed by GitLab Inc.

(From [https://en.wikipedia.org/wiki/GitLab](https://en.wikipedia.org/wiki/GitLab))
##### GitLab Stages
Normally, a pipeline for code deployment consists of the following stages:

```
1. build
2. deploy
3. systemtest
```

Each GitLab stage uses `when: on_success` as the default policy meaning that executing the current job only when all jobs from prior stages succeed. [^1]

However, sometimes, our commit might fail the `systemtest` stage after the pipeline successfully deployed the system in the pior stage. Under such scenarios, that's when the `rollback` stage should kicks in.

##### Rollback Stage
Briefly speaking, the `rollback` stage should be able to handle the `systemtest` stage scenario and rollback to the previous deployment. Therefore, we can set up the `rollback` stage as follows:

```
1. deploy
2. systemtest
3. rollback
```

And meanwhile, the rollback stage should use `when: on_failure` as its policy:

```shell
rollback:
  when: on_failure
  script:
    # do rollback job
```

to be continued...

[^1]: [https://docs.gitlab.com/ee/ci/yaml/#when](https://docs.gitlab.com/ee/ci/yaml/#when)