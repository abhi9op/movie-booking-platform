var moviePrices = {
  "Drishyam 3": 250,
  "Resident Evil": 280,
  "Prahar": 359,
  "Street Fighter": 459,
  "Avenger:Doomsday": 480,
  "Avenger:Endgame Encore": 599,
  "Ramayana": 400,
  "Godzilla Minus Kong": 170
};
var selectedSeats = [];
var movieName = new URLSearchParams(window.location.search).get("movie");
var pricePerSeat = movieName && Object.prototype.hasOwnProperty.call(moviePrices, movieName)
  ? moviePrices[movieName]
  : 220;

if (movieName) {
  document.getElementById("movie-title").textContent = movieName;
} else {
  document.getElementById("movie-title").textContent = "a Movie";
}
document.getElementById("ticket-price").textContent =
  "Price per seat: ₹" + pricePerSeat;

function selectSeat(seat) {
  var rowName = seat.parentElement.querySelector(".row-label").innerHTML;
  var seatName = rowName + seat.innerHTML;
  var seatIndex = selectedSeats.indexOf(seatName);

  if (seatIndex === -1) {
    selectedSeats.push(seatName);
    seat.classList.add("selected");
  } else {
    selectedSeats.splice(seatIndex, 1);
    seat.classList.remove("selected");
  }

  updateSelection();
}

function updateSelection() {
  var result = document.getElementById("result");
  var price = document.getElementById("price");

  if (selectedSeats.length === 0) {
    result.innerHTML = "Selected seats: None";
  } else {
    result.innerHTML = "Selected seats: " + selectedSeats.join(", ");
  }

  price.innerHTML = "Total: ₹" + (selectedSeats.length * pricePerSeat);
}

function payNow() {
  if (selectedSeats.length === 0) {
    alert("Please select a seat first.");
  } else {
    var total = selectedSeats.length * pricePerSeat;
    window.location.href = "payment.html?seats=" +
      selectedSeats.join("-") + "&total=" + total +
      (movieName ? "&movie=" + encodeURIComponent(movieName) : "");
  }
}
