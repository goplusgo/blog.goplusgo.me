---
layout: post
title: "Useful shell scripts on Kubernetes world"
summary: Some useful commmands or shell scripts used in Kubernetes environment
tags: [Kubernetes, Shell Scripts]
---

Kuberntes is becoming more and more popular in application deployment and management as a container-orchestration system. Below are some of the useful shell scripts or commands that can be used in Kubernetes world based on my daily experience.

#### Running a command in a specified pod

###### command
```shell
kubectl exec network-policy-client-pod -- curl <secure pod cluster ip address>
```

#### Retrieving a specific value from a yaml file defined in a configmap

###### command
```shell
kubectl get configmaps job-configs -o jsonpath="{.data.job-config\.yaml}" | yq read - kube.image.job
```

#### Waiting for k8s job been created

###### Scripts
```shell
timeout=$(( $(date +%s) + 60 )) 
while ! kubectl get job whatever 2>/dev/null; do
  [ $(date +%s) -gt $timeout ] && exit 1
  sleep 5
done
```

This command is quite useful as `kubectl wait` will exit immediatelly if the resource is not yet created.
