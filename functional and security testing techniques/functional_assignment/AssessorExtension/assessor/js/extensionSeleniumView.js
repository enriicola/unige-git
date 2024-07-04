class ExtensionSeleniumView {
    constructor(controller) {
        this.controller = controller;
        this.uniqueId = "modal_" + this.generateGuid();
        this.__addListener();

        this.po_session = "poSession";
        this.file_name_session = "fileName";

        //Retreive po-method
        var objsJSON = JSON.parse(localStorage.getItem(this.po_session));
        if(objsJSON !== null){
            this.map = new Map(Object.entries(objsJSON));
            var keys = Array.from(this.map.keys());
            //console.log(Array.from(that.map.keys()))
            //console.log(Array.from(that.map.values()))
            this.autocomplete(this.__el(this.__getIdPageObject()),keys);
        }else{
            this.map = new Map();
        }

        //Retreive file name from local session
        var fileName = localStorage.getItem(this.file_name_session);
        if(fileName !== null){
            console.log(fileName);
            this.__el(this.__getIdContReadFile()).innerHTML = fileName;
        }
    }

    generateGuid() {
        let result = this.generateFourUniqueValue(2);
        for (let i = 1; i < 4; i++)
            result += "-" + this.generateFourUniqueValue(2);
        return result;
    }

    generateFourUniqueValue(sequeneOf4) {
        let result = "";
        for (let i = 0; i < sequeneOf4; i++) {
            result += Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return result;
    }


    checkFields() {
        let pageObj = this.__val(this.__getIdPageObject());
        let pageMethod = this.__val(this.__getIdPageMethod());
        if (pageObj.trim().length == 0) {
            alert("Page Object empty!");
            return false;
        }
        if (pageMethod.trim().length == 0) {
            alert("Page Method empty!");
            return false;
        }
        return true;
    }

    openModal() {
        this.controller.setStartingCommands();   
    }

    clearModal(all) {
        if(all)
            this.__el(this.__getIdPageObject()).value = "";
        this.__el(this.__getIdPageMethod()).value = "";
    }

    saveCommands(saveCommands) {
        if (saveCommands) {
            this.controller.setStartingCommands();   
        }else{
            this.controller.clearCommandFromStartingPoint()
        }
    }

    __getIdModal() {
        return "assessor_modal";
    }

    __getIdClose() {
        return "assessor_close";
    }

    __getIdPageObject() {
        return "assessor_pageobject";
    }

    __getIdPageMethod() {
        return "assessor_method";
    }

    __getIdBtnConfirm() {
        return "assessor_confirm";
    }

    __getIdBtnCancel() {
        return "assessor_cancel";
    }

	__getIdBtnReadFile(){
        return "assessor_readfile";
    }
	
	__getIdContReadFile(){
        return "assessor_readfilename";
    }

    __getIdBtnClearSession(){
        return "assessor_clearSession";
    }

    __el(id) {
        return document.getElementById(id);
    }

    __val(id) {
        return document.getElementById(id).value;
    }

    __addListener() {
        let that = this;
        console.log("Apply Listener");

        this.__el(this.__getIdBtnCancel()).addEventListener("click", function () {
            that.clearModal(true);
            that.saveCommands(false);
        });

        this.__el(this.__getIdBtnConfirm()).addEventListener("click", function () {
            if (!that.checkFields())
                return;
          
            if(that.map.has(that.__val(that.__getIdPageObject()).trim())){
                if(!that.map.get(that.__val(that.__getIdPageObject()).trim()).includes(that.__val(that.__getIdPageMethod()).trim()))
                    that.map.set(that.__val(that.__getIdPageObject()).trim(), that.map.get(that.__val(that.__getIdPageObject()).trim())+','+that.__val(that.__getIdPageMethod()).trim());
            }else
                that.map.set(that.__val(that.__getIdPageObject()).trim(),that.__val(that.__getIdPageMethod()).trim());

            var map_stringify = JSON.stringify(Object.fromEntries(that.map));
            //console.log(map_stringify);
            localStorage.setItem(that.po_session, map_stringify);          
            
            that.controller.recordPO(
                that.__val(that.__getIdPageObject()).trim(),
                that.__val(that.__getIdPageMethod()).trim()
            );

            that.saveCommands(true);
            that.clearModal(false);
        });

		this.__el(this.__getIdBtnReadFile()).addEventListener("click",function(){
			that.openFile();
        });

        this.__el(this.__getIdBtnClearSession()).addEventListener("click",function(){
            localStorage.removeItem(that.po_session);
            localStorage.removeItem(that.file_name_session);

            that.map.clear();
            console.log(that.map);
            that.__el(that.__getIdContReadFile()).innerHTML="";
        });

        this.__el(this.__getIdPageObject()).addEventListener("change",function(){
            var method_elem = that.__el(that.__getIdPageMethod());
            method_elem.value = '';
            that.set_methods_base_on_po();
        });
    
        this.__el(this.__getIdPageObject()).addEventListener("focusin",function(){
           
            var po_elem = that.__el(that.__getIdPageObject());
            
            that.autocomplete(po_elem,Array.from(that.map.keys()));
            var event = new Event('input');
            po_elem.dispatchEvent(event);
        });
    
        this.__el(this.__getIdPageMethod()).addEventListener("focusin",function(){
            var method_elem = that.__el(that.__getIdPageMethod());
            that.set_methods_base_on_po();
       
            var event = new Event('input');
            method_elem.dispatchEvent(event);
        });

    }


    /*****READ FILE******/

    /*** openFile
     * the function reads a file .side
     * and create an hashMap whit all
     * the accessor command 
     * 
     * <PO>,<Methods>
     */
	openFile() {
        let that = this;

		var readFile = function(e) {
			var file = e.target.files[0];
            if (!file) {
                alert("Selected item is not a file");
				return;
			}

            var filename = file.name.split('.').pop();
            //console.log(e);
            //console.log(e.target);
			//console.log(file);
            //console.log(filename);

           if (filename !== 'side'){
                alert("Selected file is not .side");
                return;
            }
            
			//Set File name
            that.__el(that.__getIdContReadFile()).innerHTML=file.name;
            
			that.map = new Map();
			var reader = new FileReader();
			reader.onload = function(e) {
                
                //console.log(map);
                //console.log(e.target.result);
				var contents = JSON.parse(e.target.result);
				//console.log(contents);
                var tests_to_parse = contents.tests;
                //console.log(tests_to_parse);

                tests_to_parse.forEach(test => {
                    //console.log(test);
                    test.commands.forEach(command => {
                        //console.log(command);
                        // Assessor key words: {ASSESSOR} and backToMain
                        if(command.target.includes('{ASSESSOR}') && !command.target.includes('backToMain') ){
                            //console.log(command.target);

                            var assessor_command = command.target.split(':');
                            //console.log(assessor_command);
                            //console.log('PO: ' + assessor_command[1]);
                            //console.log('Method: ' + assessor_command[2]);
                            if(that.map.has(assessor_command[1])){
                                //console.log(map.get(assessor_command[1]));
                                if(!that.map.get(assessor_command[1]).includes(assessor_command[2]))
                                that.map.set(assessor_command[1], that.map.get(assessor_command[1])+','+assessor_command[2]);
                            }else
                               that.map.set(assessor_command[1],assessor_command[2]);
                        }
                           
                    });
                   
                    

                });
                console.log(that.map);
                
                //Store map in local session
                var map_stringify = JSON.stringify(Object.fromEntries(that.map));
                //console.log(map_string);
                localStorage.setItem(that.po_session, map_stringify);             
                localStorage.setItem(that.file_name_session, that.__el(that.__getIdContReadFile()).innerHTML);
               
                //console.log(Array.from(that.map.keys()));
                //console.log(Array.from(that.map.values()));
                that.autocomplete(that.__el(that.__getIdPageObject()),Array.from(that.map.keys()));
                //that.autocomplete(that.__el(that.__getIdPageMethod()),Array.from(that.map.values()));
				document.body.removeChild(fileInput);
			}
            
			reader.readAsText(file);
        }

        //Create input content
		var fileInput = document.createElement("input");
		fileInput.type='file';
		fileInput.style.display='none';
		fileInput.onchange=readFile;
		document.body.appendChild(fileInput);
		fileInput.click();
	}

  
        


    /*****AUTO-COMPLETION
     * 
     * the autocomplete function takes two arguments:
     * the text field element,
     * an array of possible autocompleted values
     * *****/
    autocomplete(inp, arr) {
        //console.log(inp);
        //console.log(arr);
        var that = this;
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function(e) {

            var val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
        
            currentFocus = -1;

            /*create a DIV element that will contain the items (values):*/
            var container_auto_complete = document.createElement("DIV");
            container_auto_complete.setAttribute("id", this.id + "autocomplete-list");
            container_auto_complete.setAttribute("class", "seleniumExtension-autocomplete-items");

            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(container_auto_complete);

            /*for each item in the array...*/
            for (var index = 0; index < arr.length; index++) {
                /*check if the item starts with the same letters as the text field value:*/
                //console.log(arr[index].substr(0, val.length).toUpperCase());
                //console.log(val.toUpperCase());
                if (val === "" || arr[index].toUpperCase().includes(val.toUpperCase())) {
                    /*create a DIV element for each matching element:*/
                    var option = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    //console.log(arr[index].substr(0, val.length));
                    if(val === ""){
                        option.innerHTML = arr[index];
                    }else{
                        var start = arr[index].toUpperCase().indexOf(val.toUpperCase());
                        //console.log("start: " + start);
                        var end = start + val.length;
                        //console.log("end: " + end);
                        option.innerHTML = arr[index].substr(0,start);
                        //console.log(arr[index].substr(0,start));
                        option.innerHTML += "<strong>" + arr[index].substr( start , val.length ) + "</strong>";
                        //console.log(arr[index].substr( start , val.length ));
                        option.innerHTML += arr[index].substr(end,arr[index].length);
                        //console.log( arr[index].substr(end,arr[index].length));
                    }
                    
                    /*insert a input field that will hold the current array item's value:*/
                    option.innerHTML += "<input type='hidden' value='" + arr[index] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    option.addEventListener("click", function(e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        
                        onChangeElem(inp);
                    
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    container_auto_complete.appendChild(option);
                }
            }
        });
        
        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function(e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) 
                x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else {
                if (e.keyCode == 38) { //up
                    /*If the arrow UP key is pressed,
                    decrease the currentFocus variable:*/
                    currentFocus--;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else 
                    if (e.keyCode == 13) {
                    /*If the ENTER key is pressed, prevent the form from being submitted,*/
                    e.preventDefault();
                    if (currentFocus > -1) {
                        /*and simulate a click on the "active" item:*/
                        if (x) x[currentFocus].click();
                    }
                }
            }
        });
        
        /*** addActive
         * function to classify an item as "active" 
         * 
         */
        function addActive(x) {
            
            if (!x) 
                return false;

            /*start by removing the "active" class on all items:*/
            removeActive(x);

            if (currentFocus >= x.length) 
                currentFocus = 0;

            if (currentFocus < 0) 
                currentFocus = (x.length - 1);

            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("seleniumExtension-autocomplete-active");
        }
        
        /*** removeActive
         * a function to remove the "active" 
         * class from all autocomplete items
         */
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("seleniumExtension-autocomplete-active");
            }
        }

        /*** closeAllLists
         * close all autocomplete lists in the document,
         * except the one passed as an argument
         */
        function closeAllLists(elmnt) {
            
            var x = document.getElementsByClassName("seleniumExtension-autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }

        function onChangeElem(elem) {
            var event = new Event('change');
            elem.dispatchEvent(event);
        }

        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
        
            var po_elem = that.__el(that.__getIdPageObject());
            var method_elem =  that.__el(that.__getIdPageMethod());
            var active_elem = document.activeElement;

            if(po_elem !== active_elem && method_elem !== active_elem)
                closeAllLists(e.target);

        });
    }

    set_methods_base_on_po(){
        var po = this.__val(this.__getIdPageObject()).trim();
        console.log(po);
        if (this.map.has(po)){
            var methods = Array.from(this.map.get(po).split(','));
            //console.log(methods);
            this.autocomplete(this.__el(this.__getIdPageMethod()),methods);
        }else{
            this.autocomplete(this.__el(this.__getIdPageMethod()),[]);
        }
    }

}