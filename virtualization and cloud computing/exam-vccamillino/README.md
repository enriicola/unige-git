# VCC 2024 Exam Template

## vcc1 camillino

[![Vcc1 02.jpg](https://upload.wikimedia.org/wikipedia/commons/8/87/Vcc1_02.jpg)](https://commons.wikimedia.org/wiki/File:Vcc1_02.jpg#/media/File:Vcc1_02.jpg)

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/doC_eKat)

## Using this project

### Virtual machines

We advise you to use this project via Vagrant (`vagrant up` to start the VMs, VMWare required).

From the `VCC-controlnode` node then you can point at the two workers `target1` and `target2`.

Of course, any way of creating two Ubuntu 24.04 machines and launching on them an Ansible playbook is fine.

If you don't have VMWare, possible alternatives are VirtualBox and libvirt.

### What has been done for you already

This project comes with plenty of pre-made stuff.
You just need to use it!

#### Local registry

This playbook will automatically provision a local registry, listening over port 5000 via HTTP.
Such registry uses NFS for its backing storage.
All nodes can reach it at `registry.vcc.internal:5000`.

#### Image building

The `swarm-images` role will automatically build and push any image found under its `files/images` directories to the [Local registry](#local-registry).

So, for instance, `files/images/forgejo` will be built and pushed as `registry.vcc.internal:5000/forgejo:latest`.

#### Image refreshing

For your own convenience, the role `pull-images` will automatically force each swarm node to re-pull locally hosted images from the local registry, ensuring their freshness.

#### Swarm services deployment

The role `swarm-services` is a good workhorse for your experimentation.

It will:

- Automatically copy all files listed in the variable `stack_file_names` from its `templates` directory to the remote host
  - We advise you to use the default value and doing everything inside of `exam.yml`
- Destroy the `vcc` docker stack
- Delete the directories under `/data` whose name is in the `stack_data_directories` variable
- Create under `/data` directories with names found in the `stack_data_directories` variable
- Copy everything found in `files/configs` to `/data/configs`
- Deploy the stack

Combining this with previous roles means that you have a powerful way to iterate on your stack files, with each run recreating the whole environment.

Please see also [the makefile targets which are available](#available-makefile-targets).

### Available makefile targets

From the root of the project run

- `make setup-all` to run all roles in playbook.yml
- `make setup-from-images-onwards` to rebuild images and redeploy all services
- `make setup-from-service-onwards` to redeploy all services
- `make python-setup` will prepare an Ansible installation with the collections indicated in `requirements.yml`

Please ensure that you have an Ansible inventory called `inventory` or set the `INVENTORY` variable in the makefile.

## Support contact

Giacomo Longo <giacomo.longo@dibris.unige.it>

## todos

- read this: <https://spacelift.io/blog/ansible-register?utm_source=tldrdevops>

<!-- docker -->
- [x] 1. Add Docker apt repository key
- [x] 2. Add Docker APT repository
- [x] 3. Install Docker and the docker-compose plugin

<!-- Docker Swarm -->
- [x] 4. Initialize Docker Swarm on the manager node
- [x] 5. Add the second node as a worker

<!-- NFS -->
- [x] 6. Install NFS client and server
- [x] 7. Configure NFS to export `/data` to the other node
- [x] 8. Ensure that:
  - [x] a. The server is running at boot
  - [x] b. The client is mounting the share at boot
  - [x] c. The playbook does not require a reboot to use the share

<!-- registry -->
- [x] 9. Create an htpasswd file for registry authentication
- [x] 10. configure the registry to require authentication using the htpasswd file
- [x] 11. Configure the registry to expose metrics
- [x] 12. Ensure that both nodes are logged in to the registry

<!-- Swarm Services - Databases -->
- [x] 13. Deploy a `postgres:17` database
- [x] 14. use the default entrypoint to create databases and users for:
  - [x] a. dex
  - [x] b. forgejo
  - [x] c. grafana
- [x] 15. ensure that the database data is persisted across restarts and changes in node

<!-- Swarm Services - traefik certificate generation -->
- [x] 16. create a tls certificate for traefik
- [x] 17. ensure that its Subject Alternate Name contains the DNS name `*.vcc.internal`
<!-- to verify run openssl x509 -text -noout -in /path/to/cert.pem
and look for the following
x509v3 extensions:
        X509v3 Subject Alternative Name:
         DNS:*.vcc.internal -->

<!--  Swarm Services - Traefik -->
- [x] 18. Deploy `public.ecr.aws/docker/lirary/traefik:v3.2.2`
- [x] 19. expose it on port 80 and 443
- [x] 20. configure traefik for service discovery with Docker Swarm labels
- [x] 21. configure the TLS endpoint on port 443 to use the self signed certificate we generated previously
- [x] 22. redirect HTTP requests to HTTPS
- [x] 23. enable access logging and prometheus metrics
<!-- Tip: to make internal services reach the xxx.vcc.internal domains you can use the "networks.xxx.aliases" parameter on the traeﬁk service -->

<!-- Swarm Services - Dex -->
- [x] 24. deploy `ghcr.io/dexidp/dex:v2.41.1-alpine`
- [x] 25. make it use the database you created
- [x] 26. set its administrative credentials
- [x] 27. enable metrics
- [x] 28. create clients for:
  - [x] forgejo
  - [x] grafana

<!-- Swarm Services - Forgejo -->
- [x] 29. customize image `codeberg.org/forgejo/forgejo:9.0.3`
- [x] 30. Use the custom entrypoint found in configs/images/forgejo
  - [x] a. Complete the contents of the forgejo_cli function
  - [x] b. complete the database health check
  - [x] c. run the database migration command
  - [x] d. create admin user
  - [x] e. wait for forgejo to be alice
  - [x] f. add the certificate from before to the system certificates
  - [x] g. wait for dex to be alive
  - [x] h. Create the openid client to use <https://auth.vcc.internal> as authentication source with the "forgejo" OAuth client

<!-- Swarm Services - Forgejo -->
- [x] 31. customize the `forgejo.ini` configuration
  - [x] a. use the database created
  - [x] b. Enable metrics
- [x] 32. Ensure that the data **and sessions** are persisted across reboots and movements between nodes
- [x] 33. expose forgejo via traefik on `https://git.vcc.internal`

<!-- Swarm Services - Grafana -->
- [x] 34. customize the image `docker.io/grafana/grafana:11.4.0`
- [x] 35. use a custom entrypoint:
  - [x] a. perform a database health check
  - [x] b. add the certificate from the system certificates
  - [x] c. wait for dex to be alive
  - [x] d. Set environment variables (using "export NAME=value") to use <https://auth.vcc.internal> as authentication source with the "grafana" OAuth client
<!-- Tip: https://grafana.com/docs/grafana/latest/setup-grafana/conﬁgure-security/conﬁgure-authentication/generic-oauth/ -->

- [x] 36. configure grafana URL as <https://mon.vcc.internal>
- [x] 37. configure grafana to use the database you created
- [x] 38. configure grafana admin credentials
- [x] 39. enable grafana metrics
- [x] 40. enable grafana provisioning
- [x] 41. ensure that grafana data is persisted
- [x] 42. expose grafana via traefik at <https://mon.vcc.internal>

<!-- Swarm Services - Prometheus -->
- [x] 43. Deploy <quay.io/prometheus/prometheus:v3.0.1>
- [x] 44. Ensure that Prometheus data is persisted
- [x] 45. Set 14 days as the metrics retention period
- [x] 46. expose prometheus via traefik at <https://prom.vcc.internal>
<!-- Tip: try to understand what prometheus.yml does for the latter points -->

<!-- Swarm Services - Node Exporter -->
- [x] 47. Deploy <quay.io/prometheus/node-exporter:v1.8.2>

<!-- Swarm Services - Loki -->
- [x] 48. Deploy <docker.io/grafana/loki:3.3.1>
- [x] 49. Ensure that loki data is persisted
- [x] 50. Enable metrics

<!-- Swarm Services - Promtail -->
- [x] 51. Deploy <docker.io/grafana/promtail:3.2.2>
- [x] 52. make it so it gathers log from your services

<!-- Swarm Services - monitoring stack -->
- [x] 53. Ensure that prometheus scrapes traefik
- [x] 54 Ensure that prometheus scrapes node-exporter
- [x] 55. Ensure that prometheus scrapes grafana
- [x] 56. Ensure that prometheus scrapes forgejo
- [x] 57. Ensure that prometheus scrapes dex
- [x] 58. Ensure that prometheus scrapes the registry on the nodes
  - [x] Tip dockerswarm_sd with role nodes
- [x] 59. using provisioning, create a Grafana dashboard with metrics and logs from traefik
- [x] 60. using provisioning, create a Grafana dashboard for swarm node metrics
- Use docker swarm service discovery unless impossible

<!-- Swarm Services - Stack di logging -->
- [x] 61. Ensure that prometheus scrapes loki
- [x] 62. Ensure that prometheus scrapes promtail
- [x] 63. Ensure that metrics from nodes can be attributed to a specific node
- [x] 64. Ensure that logs can be attributed to a specific node and/or service
- [x] 65. Using provisioning, create a Grafana dashboard for the monitoring stack
- [x] 66. Using provisioning, create a Grafana dashboard for the logging stack

<!-- additional improvements -->
- [x] 67. use uv instead of apt to install python3 and pip3
- [x] 68. check that nfs really works (create a file on one node, check it is there on the other)
- [x] 69. check that there are no passwords inside git versioning (history)
- [x] 70. check that there are no passwords in clear inside the playbooks
- [x] 71. check that there are no passwords in clear inside the environment variables
- [x] 72. check that there are no passwords in clear inside docker
