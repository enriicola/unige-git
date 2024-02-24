function addCart() {
    var value = sessionStorage.getItem("cart-number")
    value++
    sessionStorage.setItem("cart-number", value)
    document.getElementById("cart-number").innerHTML = value;
}

if (sessionStorage.getItem("cart-number") == null) {
    sessionStorage.setItem("cart-number", 0)
}

var buttons = document.getElementsByTagName('button')
for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].id != "" && buttons[i].id.match("-btncart") != null) {

        if (sessionStorage.getItem(buttons[i].name+"-countprod") == null){
            sessionStorage.setItem(buttons[i].name+"-countprod", 0)
        }

        if (sessionStorage.getItem(buttons[i].name+"-price") == null){
            sessionStorage.setItem(buttons[i].name+"-price", buttons[i].value)
        }

        buttons[i].onclick = function() {
            var value = sessionStorage.getItem(buttons[i].name+"-countprod")
            value++
            sessionStorage.setItem(buttons[i].name+"-countprod", value)
            addCart()
        }
    }     
}
