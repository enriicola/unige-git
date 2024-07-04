# ASSESSOR+: Generator module
### Requisites
1. Java: to run the tools, you need to install java at least version 8, you can find java to this link https://www.java.com/
2. Maven: to compile the source code, maven is required, you can find maven here https://maven.apache.org/install.html. To compile the code you need to use mvn install or mvn package inside the folder, the code will be compiled inside the target folder. In alternative, you can download the release version already compiled.

### How to use Assessor+ Standalone Generator
* Create a directory where the Selenium IDE code is exported with the annotations: for example C:/NameProject/
* Go to the directory where the jar file is located, and execute: java -jar AssessorTool.jar C:/NameProject
* Inside that folder, a Output folder will be created with the new TestSuite and all the PO Object
* If a warning is found, a log file is created with the details of the problem

The complete description of the tool ASSESSOR+ can be found at: https://sepl.dibris.unige.it/ASSESSOR+.php
