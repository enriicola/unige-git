let __SeleniumIDEExtController = null;
let __SeleniumIDEView = null;

console.log("Selenium IDE Script loaded");

function openModalPO() {
  checkInitialization();
  __SeleniumIDEView.openModal();
}

function stopRecordingPO() {
  checkInitialization();
  __SeleniumIDEExtController.stopRecordPO();
  __SeleniumIDEExtController.setStartingCommands();
}

function stopRecordingPOFather() {
  checkInitialization();
  __SeleniumIDEExtController.stopRecordingPOFather();
  __SeleniumIDEExtController.setStartingCommands();
}

function checkInitialization() {
  if (__SeleniumIDEExtController == null) {
    __SeleniumIDEExtController = new ExtensionSeleniumController('{a6fd85ed-e919-4a43-a5af-8da18bda539f}'); //Firefox KEY
    __SeleniumIDEExtController.activateListenerHealth();
  }
  if (__SeleniumIDEView == null) {
    __SeleniumIDEView = new ExtensionSeleniumView(__SeleniumIDEExtController);
  }
}

openModalPO();