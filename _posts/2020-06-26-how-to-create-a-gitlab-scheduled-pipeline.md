---
layout: post
title: "How to create a GitLab scheduled pipeline"
summary: 
tags: [GitLab]
---

GitLab supports [pipeline schedules](https://docs.gitlab.com/ee/ci/pipelines/schedules.html) that can be used to also run pipelines at specific intervals, see [here]. One typical usage is to run some administration jobs periodically, for instance, rotate database password every 90 days to meet security compliance. A regular GitLab pipeline consists of multiple stages/jobs. One typical example is as follows:
```yaml
stages:
  - build
  - admin_jobs
  - test
  - deploy
```
And the `admin_jobs` stage is where the `rotate_db_password` resides in. 

Meanwhile, however, we would like to only include the pick up stages/jobs that related to `rotate_db_password` in our scheduled pipeline. For this scenario, one simple workaround is to add `except` clause in each of other stages or jobs. 

##### Using `except: schedules`
Adding this except clause to other jobs will exclude them from any pipeline schedules.
```yaml
job:
  stage: build
  except:
    - schedules
```    

##### Using `except: variables`
However, sometimes, we would like the other stages/jobs been picked up by some of the pipeline schedules. In such scenarios, we can use except with variables:
```yaml
job:
  stage: build
  except:
    variables:
      - $ROTATE_DB_PASSWORD
``` 
and in our `rotate_db_password` job, we need to add `only` clause for it:

```yaml
rotate_db_password:
  stage: admin_jobs
  only:
    refs:
      - schedules
    variables:
      - $ROTATE_DB_PASSWORD
```

And lastly, in the GitLab pipeline schedules web page, we need to add this `ROTATE_DB_PASSWORD` variable and set it to true.
