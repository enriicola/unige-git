E2E Web Testing benchmark
=========================

Gherkin specifications for MantisBT
----------------------

This directory contains Gherkin speficiations for MantisBT 1.2.0.


# Deployment instructions for MantisBT 1.2.0
The Docker container for the application under test can be created using the following command:

```bash
docker run -it --workdir=/home --name=mantisbt --expose 80 --expose 3306 -p 3000:80 -p 3306:3306 -d --entrypoint ./run-services-docker.sh dockercontainervm/mantisbt:1.2.0 bash
```
The web application will be exposed on `localhost:3000/mantisbt`. The application is ready to use when the container is started, no post-installation steps are required.