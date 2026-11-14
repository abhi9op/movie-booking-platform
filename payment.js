var query = window.location.search.substring(1);
var parts = query.split("&");
var seatNames = "";
var total = "";

for (var i = 0; i < parts.length; i++) {
  var information = parts[i].split("=");

  if (information[0] === "seats") {
    seatNames = information[1];
  } else if (information[0] === "total") {
    total = information[1];
  }
}

if (seatNames !== "") {
  var seatList = seatNames.split("%2C%20");

  if (seatList.length === 1) {
    seatList = seatNames.split("-");
  }

  document.getElementById("seats").innerHTML =
    seatList.join(", ");
}

if (total !== "") {
  document.getElementById("total").innerHTML = "₹" + total;
}

function completePayment() {
  if (seatNames === "" || total === "") {
    document.getElementById("message").innerHTML =
      "Please go back and select seats first.";
    return;
  }

  var paymentMethods = document.getElementsByName("method");
  var selectedMethod = "";

  for (var i = 0; i < paymentMethods.length; i++) {
    if (paymentMethods[i].checked) {
      selectedMethod = paymentMethods[i].value;
    }
  }

  if (selectedMethod === "") {
    document.getElementById("message").innerHTML =
      "Please choose a payment method.";
  } else {
    document.getElementById("message").innerHTML =
      "Demo payment successful using " + selectedMethod + ".";
    alert("Demo payment successful!");
  }
}
