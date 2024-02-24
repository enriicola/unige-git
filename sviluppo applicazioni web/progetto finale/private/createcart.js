function updateCart(x) {
    let y = sessionStorage.getItem("cart-number")
    y = parseInt(y) + x
    sessionStorage.setItem("cart-number", y)
    document.getElementById("cart-number").innerHTML = y
}

if (sessionStorage.getItem("cart-number") == 0) {
    var node = document.createElement("li");
    var textnode = document.createTextNode("Acquista un viaggio allo shop!")
    node.appendChild(textnode)
    document.getElementById("list-items").appendChild(node)

    var sumnode = document.createElement("li");
    textnode = document.createTextNode("Nessun viaggio")
    sumnode.appendChild(textnode)
    document.getElementById("list-sum-items").appendChild(sumnode)
} else {

    var sessions = Object.keys(sessionStorage)
    for (let i = 0; i < sessions.length; i++) {

        if (sessionStorage.getItem(sessions[i]) != 0 && sessions[i].match("-countprod") != null) {

            var node = document.createElement("li")
            var textnode = document.createTextNode(sessions[i].slice(0, -10))

            var plusbtn = document.createElement("button")
            plusbtn.classList.add('plus');
            plusbtn.setAttribute("id", sessions[i])

            plusbtn.onclick = function() {
                var value = sessionStorage.getItem(sessions[i])
                value++
                sessionStorage.setItem(sessions[i], value)
                updateCart(1)
                location.reload()
            }

            var quantity = document.createElement("input")
            quantity.setAttribute("value", sessionStorage.getItem(sessions[i]))
            quantity.setAttribute("id", "id-"+sessions[i])

            var minbtn = document.createElement("button")
            minbtn.classList.add('minus');
            plusbtn.setAttribute("id", sessions[i])

            minbtn.onclick = function() {
                var value = sessionStorage.getItem(sessions[i])
                value--
                if (value == 0) location.reload()
                sessionStorage.setItem(sessions[i], value)
                updateCart(-1)
                location.reload()
            }

            node.appendChild(textnode)
            node.appendChild(plusbtn)
            node.appendChild(quantity)
            node.appendChild(minbtn)

            document.getElementById("list-items").appendChild(node)
        }
    }



    var nodeSped = document.createElement("li")
    var numItems = parseInt(sessionStorage.getItem("cart-number"))
    var totalsped = 100 * numItems
    textnode = document.createTextNode("Costo spedizione: "+totalsped+"$")
    nodeSped.appendChild(textnode)
    document.getElementById("list-sum-items").appendChild(nodeSped)


    var nodeTrip = document.createElement("li")
    var total = 0
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].match("-price") != null) {
            total += parseInt(sessionStorage.getItem(sessions[i])) * parseInt(sessionStorage.getItem(sessions[i].slice(0, -6)+"-countprod"))
        }
    }

    var textnode = document.createTextNode("Totale viaggi: "+total+"$")
    nodeTrip.appendChild(textnode)
    document.getElementById("list-sum-items").appendChild(nodeTrip)


    var nodeTotal = document.createElement("li")
    total += totalsped
    textnode = document.createTextNode("Totale: "+total+"$")
    nodeTotal.appendChild(textnode)
    document.getElementById("list-sum-items").appendChild(nodeTotal)

}


if (sessionStorage.getItem("cart-number") != 0) {
    var checkout = document.getElementById("button-checkout")
    checkout.onclick = function () { 

        var fetches = [];
        for (let i = 0; i < sessions.length; i++) {
            if (sessionStorage.getItem(sessions[i]) != 0 && sessions[i].match("-countprod") != null) {

                fetches.push(
                    fetch('../../private/addorder.php', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        body: "p="+sessions[i].slice(0,-10)+"&t="+sessionStorage.getItem(sessions[i])
                    })
                )
            }
        }

        for (let i = 0; i < sessions.length; i++) {
            if (sessionStorage.getItem(sessions[i]) != 0 && sessions[i].match("-countprod") != null) {
                sessionStorage.setItem(sessions[i], 0)
            }
        }

        sessionStorage.setItem("cart-number", 0)
        
        Promise.all(fetches).then(function() {
            location.replace("shop.php")
          });

    }
}