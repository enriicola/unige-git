/**
 * This script is used to manage the communication
 * between the web page and the extension
 */
 browser.runtime.onMessage.addListener(({ trigger }) => {
	console.log("trigger: " + trigger);
	if (trigger === 'checkRecordingStatus') checkRecordingStatus();
	if (trigger === 'extensionIsColsed') extensionIsColsed();
  });

//check if the recording is started or not
function checkRecordingStatus() {
	let checkRecording = document.getElementById('selenium-ide-indicator');
	let message = {
		command: "open-modal",
		message: "The recording is started?",
		answer: false
	}
	if (checkRecording == null) {
		alert("The recording is not active!");
		browser.runtime.sendMessage({ trigger: 'checkRecordingStatus', message });
		
	} else {
		message.answer = true;
		browser.runtime.sendMessage({ trigger: 'checkRecordingStatus', message });
	}
}

//check if the recording is started or not
function extensionIsColsed() {
	alert("The extension is closed, you cannot use this command");
	return;
}