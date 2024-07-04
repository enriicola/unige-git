class ExtensionSeleniumController {
    constructor(apiKey) {
        this.apiKey = apiKey;

    }

    activateListenerHealth() {
        this.__createListenerHealth();
    }

    __log(msg) {
        console.log("[SelIDEExt] " + msg);
    }

    __error(obj) {
        console.error(obj);
    }

    __sendMessage(payload) {
        return browser.runtime.sendMessage(this.apiKey, payload);
    }

    __createListenerHealth() {
        this.__log("Activate Polling");
        if (this.__timerHealth !== null) clearInterval(this.__timerHealth);
        let that = this;
        //Creare checker for Open window of Selenium IDE Plugin
        this.__timerHealth = setInterval(() => {
            that.__sendMessage({
                uri: "/health",
                verb: "get"
            })
                .then(res => {
                    //If selenium ide is open, then try register
                    //res could be Object (error) or true/false 
                    //if it is false, it's mean that the application is not registered
                    if (!res) {
                        that.__log("Try Register");
                        that.__register();
                    }
                })
                .catch(res => {
                    that.__error(res);
                });
        }, 1000);
    }

    __register() {
        let that = this;
        this.__sendMessage({
            uri: "/register",
            verb: "post",
            payload: {
                name: "Selenium IDE plugin",
                version: "1.0.0",
                commands: [
                    {
                        id: "successfulCommand",
                        name: "successful command"
                    },
                    {
                        id: "failCommand",
                        name: "failed command"
                    }
                ]
            }
        }).then(res => {
            if (res) {
                that.__log("Registered");
            } else {
                that.__error(res);
            }
        }).catch(res => {
            console.error(res);
            console.error("Error?");
        });
    }

    recordCommand(command, target, value, select) {
        //Wrong documentation at https://www.selenium.dev/selenium-ide/docs/en/api/plugins/record
        //it should contain the payload
        let data = {
            uri: "/record/command",
            verb: "post",
            payload: {
                command: command,
                target: target,
                value: value,
                select: select
            }
        };
        return this.__sendMessage(data);
    }

    getCommands() {
        let payLoad = {
            uri: "/record/command",
            verb: "get"
        };
        return this.__sendMessage(payLoad);
    }

    setStartingCommands() {
        let that = this;
        this.getCommands().then(res => {
            that.startingCommand = res;
        });
        
    }

    __getStartingCommands() {
        return this.startingCommand;
    }

    deleteCommandId(id) {
        let that = this;
        let data = {
            uri: '/record/command',
            verb: 'delete',
            id: id,
            payload: {
                id: id
            }
        };
        this.__sendMessage(data).then(res => {
        })
            .catch(res => {
                that.__error(res);
            });
    }

    clearCommandFromStartingPoint() {
        let that = this;
        let startingCommand = this.__getStartingCommands();
        console.log(startingCommand);
        this.getCommands().then(res => {
            console.log(res);
            for (let i = startingCommand.commands.length; i < res.commands.length; i++) {
                if (res.commands[i].command == "open" || res.commands[i].command == "setWindowSize") {
                    continue;
                }
                that.deleteCommandId(res.commands[i].id);
            }
        });
    }

    recordPO(pageObject, methodName) {
        if (pageObject == "" || pageObject == null) {
            throw new Error("Page object is empty or null")

        }

        if (methodName == "" || methodName == null) {
            throw new Error("Method name is empty or null")
        }
        //this.clearCommandFromStartingPoint();
        this.recordCommand("echo", `{ASSESSOR}:${pageObject}:${methodName}`, "", false);
        return true;
    }

    stopRecordPO() {
        this.recordCommand("echo", `{ASSESSOR}backToMain`, "", false);
        return true;
    }

    stopRecordingPOFather() {
        this.recordCommand("echo", `{ASSESSOR}backToFather`, "", false);
        return true;
    }
}