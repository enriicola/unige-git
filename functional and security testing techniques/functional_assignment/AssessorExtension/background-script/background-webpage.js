/**
 * This script is used to manage the communication between the 
 * extension and the web page
 * 
*/

/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

/*
Called when the item has been removed.
We'll just log success here.
*/
function onRemoved() {
  console.log("Item removed successfully");
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}

/*
Create all the context menu items.
browser.contextMenus.create({
  id: "open-modal",
  title: "open-modal",
  onclick: checkRecordingStatus
}, onCreated);

browser.contextMenus.create({
  id: "extention-close",
  title: "extention-close",
  onclick: extensionIsColsed
}, onCreated);


Define all the action
*/
function getCurrentTab() {
  return browser.tabs.query({ currentWindow: true, active: true });
}

async function checkRecordingStatus() {
  const tabInfo = await getCurrentTab();
  const [{ id: tabId }] = tabInfo;
  browser.tabs.sendMessage(tabId, { trigger: 'checkRecordingStatus' });
}

async function extensionIsColsed() {
  const tabInfo = await getCurrentTab();
  const [{ id: tabId }] = tabInfo;
  browser.tabs.sendMessage(tabId, { trigger: 'extensionIsColsed' });
}

/*
Handle the callback
*/
function handleMessage(request, sender, sendResponse) {
  console.log("Message: " + JSON.stringify(request));

  if (request.trigger == 'checkRecordingStatus') {
    if (request.message.answer == true) {
      openModalPO();
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage);