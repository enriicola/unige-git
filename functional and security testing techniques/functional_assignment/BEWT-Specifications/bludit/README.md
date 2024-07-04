E2E Web Testing benchmark
=========================

Gherkin specifications for Bludit
----------------------

This directory contains Gherkin speficiations for testing Bludit 2.3.4.

# Deployment instructions
The Docker container for the application under test can be created using the following commands:

```bash
docker run --name bludit -p 8080:80 -d bludit/docker:2.3.4
```

The web application will be exposed on `localhost:8080`. 

# Installation instructions

Once the container is deployed, the user must connect to `/install.php` and follow the installation wizard. The required language is English, the required password is `password`.

