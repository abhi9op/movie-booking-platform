var query = window.location.search.substring(1);
var parts = query.split("&");
var seatNames = "";
var total = "";
var selectedSeats = [];
var movieName = new URLSearchParams(window.location.search).get("movie");

if (movieName) {
  document.getElementById("movie").textContent = movieName;
  document.getElementById("seats-link").href =
    "seat.html?movie=" + encodeURIComponent(movieName);
}

for (var i = 0; i < parts.length; i++) {
  var information = parts[i].split("=");

  if (information[0] === "seats") {
    seatNames = information[1];
  } else if (information[0] === "total") {
    total = information[1];
  }
}

if (seatNames !== "") {
  selectedSeats = seatNames.split("%2C%20");

  if (selectedSeats.length === 1) {
    selectedSeats = seatNames.split("-");
  }

  document.getElementById("seats").innerHTML =
    selectedSeats.join(", ");
}

if (total !== "") {
  document.getElementById("subtotal").textContent = "₹" + total;
  document.getElementById("total").textContent = "₹" + total;
}

function applyCoupon() {
  var couponMessage = document.getElementById("coupon-message");
  var couponCode = document.getElementById("coupon-code").value.trim().toUpperCase();
  var subtotal = Number(total);

  document.getElementById("discount").textContent = "₹0";
  document.getElementById("total").textContent = "₹" + total;

  if (seatNames === "" || !Number.isSafeInteger(subtotal) || subtotal <= 0) {
    couponMessage.textContent = "Please select seats before applying a coupon.";
    return;
  }

  var discountAmount = 0;

  if (couponCode === "MOVIE20") {
    discountAmount = Math.round(subtotal * 0.2);
  } else if (couponCode === "STUDENT20") {
    discountAmount = Math.round(subtotal * 0.2);
  } else if (couponCode === "MOVIEWEEKEND") {
    var day = new Date().getDay();

    if (day !== 0 && day !== 6) {
      couponMessage.textContent = "MOVIEWEEKEND is valid only on Saturdays and Sundays.";
      return;
    }

    if (selectedSeats.length < 2) {
      couponMessage.textContent = "MOVIEWEEKEND requires at least two seats.";
      return;
    }

    var freeSeats = Math.floor(selectedSeats.length / 2);
    discountAmount = Math.round(subtotal * freeSeats / selectedSeats.length);
  } else if (couponCode === "REFERFRIEND") {
    discountAmount = Math.min(subtotal, 50);
  } else {
    couponMessage.textContent = "Invalid coupon code.";
    return;
  }

  document.getElementById("discount").textContent = "₹" + discountAmount;
  document.getElementById("total").textContent = "₹" + (subtotal - discountAmount);
  if (couponCode === "MOVIE20") {
    couponMessage.textContent = "MOVIE20 applied: 20% off.";
  } else if (couponCode === "STUDENT20") {
    couponMessage.textContent = "STUDENT20 applied: 20% off.";
  } else if (couponCode === "MOVIEWEEKEND") {
    couponMessage.textContent = "MOVIEWEEKEND applied: buy one seat, get one free.";
  } else {
    couponMessage.textContent = "REFERFRIEND applied: ₹" + discountAmount + " off.";
  }
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
    document.getElementById("message").textContent = "Payment successful.";
  }
}
