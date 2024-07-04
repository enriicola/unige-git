E2E Web Testing benchmark
=========================

Gherkin specifications for Claroline
----------------------

This directory contains Gherkin speficiations for Claroline.

# Deployment instructions
The Docker container for the application under test can be created using the following commands:

```bash
docker run -it --workdir=/home/claroline --name=claroline --expose 80 --expose 3306 -p 3000:80 -p 3306:3306 -d --entrypoint ./run-services-docker.sh dockercontainervm/claroline:1.11.10 bash
```

The web application will be exposed on `localhost:3000`. The application is ready to use when the container is started, no post-installation steps are required.

