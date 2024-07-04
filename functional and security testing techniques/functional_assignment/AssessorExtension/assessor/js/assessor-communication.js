/**
 * This script is used to manage the communication
 * between the web page and the extension
 */

/**
 * This function is used to send messages to the background script.
*/

function handleResponse(message) {
	console.log('response:' + message);
}

function handleError(error) {
	console.log('Error:' + error);
}

window.onbeforeunload = function () {
	//Through this message, we notify
	//that the assessor page is closed
	let sending = browser.runtime.sendMessage({
		command: "assessor-close",
		message: "Assessor page is closed"
	});
	
	sending.then(handleResponse, handleError);
	return;
};

/**
 * This function is used to manage messages coming from the background script.
*/
var myPort = browser.runtime.connect({ name: "port-from-cs" });

myPort.onMessage.addListener(function (message) {
	console.log("Received message: " + JSON.stringify(message));
	if(message.command == 'close-action')
		stopRecordingPO();
	
	if(message.command == 'close-action-father')
		stopRecordingPOFather();

	
});