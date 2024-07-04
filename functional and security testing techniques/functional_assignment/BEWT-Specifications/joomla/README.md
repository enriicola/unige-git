E2E Web Testing benchmark
=========================

Gherkin specifications for Joomla
----------------------

This directory contains Gherkin speficiations and automated installer for Joomla 3.10.11.

# Deployment instructions
The Docker containers for Joomla 3.10.11 can be created using the `docker-compose.yml` file contained in this directory. Just move into the directory using a terminal and type:

```bash
docker compose up
```
The web application will be exposed on `localhost:8080`. After the containers are deployed, an installation wizard must be followed. Please refer to the further section **Installation instructions**

# Installation instructions

The installation wizard can be executed automatically by running `InstallerTest.install` (located in the Maven project `joomla-installer-3.10.11`) as a JUnit test. You can run it with Maven using the command 
```bash
mvn test -Dtest=InstallerTest#install
``` 
in the directory `joomla-installer-3.10.11` 
If, for any reason, the automatic installation fails, these are the parameters that you should set in the installation wizard:

*	Language: English (United States)
*	Site name: TestRigor joomla test
*	Email: dario@fake.com
*	Username: administrator
*	Password: root
* 	Database type: MySQLi
*	Host Name: joomladb
*	Username (database): root
* 	Password (database): example
*	Database name: joomla310
*	Install sample data: Blog English (GB) Sample Data
*	E-mail configuration: No
* 	Remove installation folder

After completing the installation wizard (either manually or automatically), you need to access to the administration area of the application (http://localhost:8080/administrator), login and close some notifications, that otherwise would change the expected layout of the page and make test scripts fail. In detail, you have to answer "Never" to the permission to collect statistics, and read all post installation messages. 


![First step](https://i.imgur.com/1e2D90G.png "Answer Never to the permission to collect statistics")

![Second step](https://i.imgur.com/wNhU1jN.png "Click Read messages")

![Third step](https://i.imgur.com/KtPDmyw.png "Click Hide all messages")