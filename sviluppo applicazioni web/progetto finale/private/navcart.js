if (sessionStorage.getItem("cart-number") === null) {
    sessionStorage.setItem("cart-number", 0);
}

var value = parseInt(sessionStorage.getItem("cart-number"))
var str = value.toString();
sessionStorage.setItem("cart-number", str);
document.getElementById("cart-number").innerHTML = str;