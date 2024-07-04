# ASSESSOR+: Browser Extension module

### Requisites
1. Firefox: the browser can be downloaded at https://www.mozilla.org/ , follow the instruction on the site for the installation.
2. Selenium Ide: the extension can be found at https://addons.mozilla.org/en-US/firefox/addon/selenium-ide/, follow the instruction on the site for the installation.

### How to use Assessor+ Browser Extension
* Install the plugin: clone the repository to your local machine, then open Firefox and type in the url about:debugging and then press enter. When the settings page is loaded, click on This Firefox and then click on Load temporary Add-On... After that, browse to the folder where you cloned the repository, and double click on the manifest.json.
* Use of the plugin: After the Selenium IDE recording start, press F8 to start the declaration of a PO Class and a PO Method. A popup will appear if the recording of Selenium IDE is going, and after the press of “Submit” a new instruction will be add automatically to Selenium Ide “{ASSESSOR}:PoName:PoMethod”. To stop the declaration of a PO Method, press F4 during the recording, a new command “{ASSESSOR}backToMain” will be added to the list of commands of Selenium Ide.

The complete description of the tool ASSESSOR+ can be found at: https://sepl.dibris.unige.it/ASSESSOR+.php
