---
title: Setup Dockerize GitLab Runner on Synology NAS
date: 2019-04-18
description: Tutorial for setting up a GitLab Runner (docker executor, docker in docker, dind) on Synology NAS DSM
categories:
  - vuepress
tags:
  - gitlab_runner
  - docker
  - docker_in_docker
  - ci_cd
  - dev-notes
---

In this article, I will illustrate how to setup a GitLab Runner with docker executor on Synology NAS DSM.  And also show you how to setup docker-in-docker for docker executor in a container to call other docker containers/images on the host.

## Environment

I have two Synology NAS and I tested the steps in this article on both devices.  And the system (DSM) versions are the same.

* Synology DS916+ and DS718+
* DSM 6.2.1-23824 Update 6

Although there are some differences from regular Docker installation, I used the Docker package from Synology Package Center which provides GUI for easy management.

* Docker v17.05.0-0400

For GitLab Runner, I use the latest official docker image

* gitlab/gitlab-runner:latest (11.8.0 as the time of writing)
  * Git revision: 4745a6f3
  * GIt branch 11-8-stable
  * GO version: goi1.8.7
  * Built: 2019-02-22T08:01:16+0000
  * OS/Arch: linux/amd64

## Installation

In the following tutorial, I will assume you have admin (root) control of your Synology NAS system.  And also already installed the Docker package from Synology Package Center.

For GitLab, you may use [gitlab.com](https://gitlab.com), or a self-hosted GitLab CE.  Please note that it is impossible to setup a `Shared Runner` on gitlab.com since the admin of it is GitLab company itself.

### Install Dockerized GitLab Runner

There are many ways to run a GitLab Runner.  And one of the easiest way is to install the runner as a docker service.  It's so easy to install and run the runner as a docker service since there are GitLab official Runner docker image on [Docker Hub](https://hub.docker.com/r/gitlab/gitlab-runner/), and also [official installation guide](https://docs.gitlab.com/runner/install/docker.html).

To install a GitLab Runner on Synology NAS, first, SSH into your NAS.

{{< warning >}}
You must enable SSH login in `Control Panel > Terminal & SNMP > Terminal (tab) > Enable SSH service (checkbox)`.  And only accounts beloning to the administrators group are able to login into NAS via SSH.
{{< /warning >}}



And use the command below to install a latest official GitLab Runner:

```bash
docker run -d \
--name gitlab-runner-docker \
--restart always \
--env HTTP_PROXY="http://127.0.0.1:3128" \
--env HTTPS_PROXY="http://127.0.0.1:3128" \
-v /run/docker.sock:/var/run/docker.sock \
gitlab/gitlab-runner:latest
```

* `--name` is your container's name which will also appear in **Synology Docker > Container** GUI.
* `--restart always` will set your container auto-restart.
* `--env` will set the container's environment variables.  In this example, I set the proxy for my container. (optional)
* `-v` to monut the host file in containers.  Here I mount the host `docker.sock` which will allow the container to access the host docker, which is known as **Docker-in-Docker**.  We need this since I want to run the GitLab Runner as docker executor which will illustrate later.

{{< warning >}}
The Docker containers should be run as an isolated environment.  Please read [this article](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/) first before setting up Docker-in-Docker.
{{< /warning >}}



That's it!  Your GitLab Runner should be installed and up.  Check it by SSH into your Docker container:

```bash
docker exec -it gitlab-runner-docker /bin/bash
```

* `gitlab-runner-docker` is the container name, you should change it accordingly.

{{< tip >}}
You may run any command in your container by:

```bash
docker exec -it <container name> <command>
```
{{< /tip >}}



And you can also see the container running in Synology Docker GUI.

### Register GitLab Runner with Docker Executor Mode

Before using the runner in GitLab, we have to register the runner the the GitLab first.  There are several types of runners on GitLab:

* Shared Runners
* Specific Runners
* Group Runners

For more runner type please read the [official documents](https://docs.gitlab.com/ee/ci/runners/#shared-specific-and-group-runners).

In the following tutorial, I will illustrate how to register a specific runner to gitlab.com with configs below:

* GitLab Runner
  * Hosted on Synology NAS
  * Official gitlab-runner docker image
  * GitLab Runner name: `gitlab-runner-docker`
* GitLab
  * Using official GitLab (gitlab.com)

To register the runner, SSH into Synology NAS and run command with root:

```bash
docker exec -it gitlab-runner-docker gitlab-runner register
```

the `gitlab-runner` is the tool command for the runner, and `register` will start the wizard to register the runner to GitLab.  For example:

```root@Synology-Nas:~# docker exec -it gitlab-runner-docker gitlab-runner register
Runtime platform                                    arch=amd64 os=linux pid=30 revision=4745a6f3 version=11.8.0
Running in system-mode.

Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/):
https://gitlab.com
Please enter the gitlab-ci token for this runner:
Examp1eT0ken
Please enter the gitlab-ci description for this runner:
[gitlab-runner-docker]:
Please enter the gitlab-ci tags for this runner (comma separated):

Registering runner... succeeded                     runner=Examp1eT0ken
Please enter the executor: docker, shell, ssh, kubernetes, docker-ssh, parallels, virtualbox, docker+machine, docker-ssh+machine:
docker
Please enter the default Docker image (e.g. ruby:2.1):
node:latest
Runner registered successfully. Feel free to start it, but if it's running already the config should be automatically reloaded!
```

In the example above, set the URL to gitlab.com and enter the token (`Examp1eT0ken` for example).  To get the token, you need to go to your `GitLab project > Settings > CI/CD` and expand `Runners` section where you can find the URL and token to copy.

The description and tags can be skip if you don't need it.  And the register wizard will try to connect to gitlab.com and register the runner.

And then you have to set the executor of the runner.  There are many types of the executors, read the [official document](https://docs.gitlab.com/runner/executors/) for details.  In this tutorial, I set `docker` executor for example.  And the wizard will ask for default docker image if you set docker executor.

The GitLab runner is now set and all the settings will be store in `/etc/gitlab-runner/config.toml`.

For more details about registering the runners please read the [official document](https://docs.gitlab.com/runner/register/index.html).

### Setup Docker-in-Docker

Since we set the runner executor as **docker** mode, I would suggest setup docker-in-docker which will allow your gitlab-runner container to call and use the containers on the host (Synology NAS).  This will make you more easy to manage all your containers in Synology Docker GUI.

{{< warning >}}
Please read this article before setup docker-in-docker:

[Using Docker-in-Docker for your CI or testing environment? Think twice.](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/)
{{< /warning >}}



To setup docker-in-docker, we first need to SSH into the container (with root):

```bash
docker exec -it gitlab-runner-docker /bin/bash
```

and edit the runner config file:

```bash
vi /etc/gitlab-runner/config.toml
```

We have to add `privileged = true` and `pull_policy = "if-not-present"` to the config file:

```tomlconcurrent = 1
check_interval = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "GitLab Runner Docker"
  url = "https://gitlab.com"
  token = "Examp1eT0ken"
  executor = "docker"
  [runners.docker]
    tls_verify = false
    image = "node:latest"
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
    privileged = true
    pull_policy = "if-not-present"
  [runners.cache]
    [runners.cache.s3]
    [runners.cache.gcs]
```

* `privileged` will set the container to run in privileged mode which is needed to run docker-in-docker.
* `pull_policy` is optional setting which tells the docker runner to pull docker images or not.  There are 3 options:
  * `never` will never pull docker images and only use local pulled images
  * `if-not-present` will pull images if the desired image is not exist in local
  * `always` will always pull docker images everytime

I suggest `if-not-present` to save the network bandwidth and the pulling time.  For more details please read the [offcial document](https://docs.gitlab.com/runner/executors/docker.html#how-pull-policies-work).

For more configs instruction please read the [official document](https://docs.gitlab.com/runner/configuration/advanced-configuration.html).

After setting the config, you need to restart the container to apply the settings.

{{< warning >}}
Since it's impossible to bind the system path to docker container from Synology Docker GUI, do not edit the container settings in Synology Docker GUI which will remove your volume bindings you set with command line before.
{{< /warning >}}



And now your GitLab runner is all set and ready to run jobs in docker mode.

### Unregister the GitLab Runner

You can unregister a GitLab runner from runner-side so that you don't need to go to GitLab and find the runners by yourself.  The unregister command will automatically unregister the runner and remove related setting on GitLab.

All you need to do is one command with `url` and `token` parameters:

```
root@gitlab-runner-docker:/# gitlab-runner unregister --url https://gitlab.com/ --token An0therExamp1eT0ken
Runtime platform                                    arch=amd64 os=linux pid=80 revision=4745a6f3 version=11.8.0
Running in system-mode.

Unregistering runner from GitLab succeeded          runner=An0therExamp1eT0ken
```

{{< warning >}}
The token is not the token we used while registering the runner.  You can find the runner token in runner detail page on GitLab:

<https://gitlab.com/user-name/project-name/runners/runner-id>

Replace `user-name`, `project-name` and `runner-id` for your own.  Or click the runner in `Runners` section in `GitLab project > Settings > CI/CD`.
{{< /warning >}}



## References

<https://stackoverflow.com/questions/45051723/changing-gitlab-ci-multirunner-executor-after-initial-configuration>
<http://phase2.github.io/devtools/common-tasks/ssh-into-a-container/>
<https://docs.docker.com/v17.09/engine/userguide/networking/>
<https://docs.docker.com/network/proxy/>
<https://forums.docker.com/t/how-can-i-run-docker-command-inside-a-docker-container/337/8>
<https://docs.gitlab.com/ee/ci/docker/using_docker_images.html>
<https://gitlab.com/gitlab-examples/docker>
<http://blog.chengweichen.com/2016/04/docker-gitlab-cigitlab-runner.html>
