
const storageKeys = {
  movies: "cinebook.movies",
  bookings: "cinebook.bookings",
  users: "cinebook.users"
};

function readList(key) {
  var savedData = localStorage.getItem(key);

  if (savedData === null) {
    return [];
  }

  try {
    var list = JSON.parse(savedData);

    if (!Array.isArray(list)) {
      throw new Error("Saved data must be a list.");
    }

    for (var i = 0; i < list.length; i++) {
      if (!list[i] || typeof list[i] !== "object" || Array.isArray(list[i])) {
        throw new Error("A saved record is not valid.");
      }
    }

    return list;
  } catch (error) {
    throw new Error("Could not read " + key + " from browser storage.");
  }
}

function formatMoney(amount) {
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function getAmount(booking) {
  
  var amount = Number(booking.totalAmount || booking.amount || 0);

  if (isNaN(amount) || amount < 0) {
    return 0;
  }

  return amount;
}

function isPaid(booking) {

  return String(booking.paymentStatus || "").toLowerCase() === "paid";
}

function getBookingDate(booking) {
  var dateText = booking.bookingDate || booking.date;

  if (!dateText) {
    return null;
  }

  var date = new Date(dateText);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function isSameDay(firstDate, secondDate) {
  return firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate();
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function showError(messageText) {
  var message = document.getElementById("dashboard-message");
  message.textContent = messageText;
  message.hidden = false;
}


function makeWeekDays() {
  var days = [];
  var today = new Date();

  for (var offset = 6; offset >= 0; offset--) {
    var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    days.push({ date: date, bookings: 0, revenue: 0 });
  }

  return days;
}

function drawChart(chartId, days, valueName, emptyText, showMoney) {
  var chart = document.getElementById(chartId);
  var largestValue = 0;

  for (var i = 0; i < days.length; i++) {
    if (days[i][valueName] > largestValue) {
      largestValue = days[i][valueName];
    }
  }

  chart.textContent = "";

  if (largestValue === 0) {
    var emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = emptyText;
    chart.appendChild(emptyMessage);
    return;
  }

  for (var dayIndex = 0; dayIndex < days.length; dayIndex++) {
    var day = days[dayIndex];
    var column = document.createElement("div");
    var track = document.createElement("div");
    var bar = document.createElement("div");
    var label = document.createElement("span");

    column.className = "chart-column";
    track.className = "chart-track";
    bar.className = "chart-bar";
    bar.style.height = (day[valueName] / largestValue * 100) + "%";

    if (showMoney) {
      bar.title = formatDate(day.date) + ": " + formatMoney(day[valueName]);
    } else {
      bar.title = formatDate(day.date) + ": " + day[valueName] + " bookings";
    }

    label.className = "chart-label";
    label.textContent = day.date.toLocaleDateString("en-IN", { weekday: "short" });
    track.appendChild(bar);
    column.appendChild(track);
    column.appendChild(label);
    chart.appendChild(column);
  }
}

function updateBookingStatusCounts(bookings) {
  var confirmed = 0;
  var pending = 0;
  var cancelled = 0;

  for (var i = 0; i < bookings.length; i++) {
    var status = String(bookings[i].bookingStatus || bookings[i].status || "pending").toLowerCase();

    if (status === "confirmed") {
      confirmed++;
    } else if (status === "cancelled" || status === "canceled") {
      cancelled++;
    } else {
      pending++;
    }
  }

  document.getElementById("confirmed-bookings").textContent = String(confirmed);
  document.getElementById("pending-bookings").textContent = String(pending);
  document.getElementById("cancelled-bookings").textContent = String(cancelled);
}

function updatePopularMovies(bookings) {
  var titles = [];
  var counts = [];

  for (var i = 0; i < bookings.length; i++) {
    var title = bookings[i].movieTitle || bookings[i].movieName;

    if (!title) {
      continue;
    }

    var titleIndex = 0;
    while (titleIndex < titles.length && titles[titleIndex] !== title) {
      titleIndex++;
    }

    if (titleIndex === titles.length) {
      titles.push(title);
      counts.push(1);
    } else {
      counts[titleIndex]++;
    }
  }

  for (var first = 0; first < counts.length; first++) {
    for (var second = first + 1; second < counts.length; second++) {
      if (counts[second] > counts[first]) {
        var savedCount = counts[first];
        counts[first] = counts[second];
        counts[second] = savedCount;

        var savedTitle = titles[first];
        titles[first] = titles[second];
        titles[second] = savedTitle;
      }
    }
  }

  var list = document.getElementById("popular-movie-list");
  list.textContent = "";

  if (titles.length === 0) {
    var emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-state";
    emptyMessage.textContent = "Popular movies will appear when bookings are saved.";
    list.appendChild(emptyMessage);
    return;
  }

  for (var movieIndex = 0; movieIndex < titles.length && movieIndex < 5; movieIndex++) {
    var row = document.createElement("p");
    var count = document.createElement("span");
    row.className = "movie-row";
    row.textContent = titles[movieIndex];
    count.textContent = counts[movieIndex] + " bookings";
    row.appendChild(count);
    list.appendChild(row);
  }
}

function addTableCell(row, text) {
  var cell = document.createElement("td");
  cell.textContent = text;
  row.appendChild(cell);
}

function updateRecentBookings(bookings) {
  var tableBody = document.getElementById("recent-bookings-body");
  tableBody.textContent = "";

  if (bookings.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.className = "empty-cell";
    emptyCell.colSpan = 9;
    emptyCell.textContent = "No bookings saved yet.";
    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  var shown = 0;
  for (var i = bookings.length - 1; i >= 0 && shown < 5; i--) {
    var booking = bookings[i];
    var seats = booking.seats || "—";

    if (Array.isArray(seats)) {
      seats = seats.join(", ");
    }

    var values = [
      String(booking.bookingId || booking.id || "—"),
      String(booking.customerName || "—"),
      String(booking.movieTitle || booking.movieName || "—"),
      String(booking.theatreName || booking.theatre || "—"),
      String(seats),
      formatDate(getBookingDate(booking)),
      formatMoney(getAmount(booking)),
      String(booking.paymentStatus || "Pending"),
      String(booking.bookingStatus || booking.status || "Pending")
    ];
    var row = document.createElement("tr");

    for (var valueIndex = 0; valueIndex < values.length; valueIndex++) {
      addTableCell(row, values[valueIndex]);
    }

    tableBody.appendChild(row);
    shown++;
  }
}

function loadDashboard() {
  var message = document.getElementById("dashboard-message");
  message.hidden = true;

  try {
    var movies = readList(storageKeys.movies);
    var bookings = readList(storageKeys.bookings);
    var users = readList(storageKeys.users);
    var days = makeWeekDays();
    var totalRevenue = 0;
    var weeklyRevenue = 0;

    for (var bookingIndex = 0; bookingIndex < bookings.length; bookingIndex++) {
      var booking = bookings[bookingIndex];

      if (isPaid(booking)) {
        totalRevenue += getAmount(booking);
      }

      var bookingDate = getBookingDate(booking);

      if (bookingDate) {
        for (var dayIndex = 0; dayIndex < days.length; dayIndex++) {
          if (isSameDay(bookingDate, days[dayIndex].date)) {
            days[dayIndex].bookings++;

            if (isPaid(booking)) {
              days[dayIndex].revenue += getAmount(booking);
            }
          }
        }
      }
    }

    for (var dayIndex = 0; dayIndex < days.length; dayIndex++) {
      weeklyRevenue += days[dayIndex].revenue;
    }

    document.getElementById("total-movies").textContent = String(movies.length);
    document.getElementById("total-bookings").textContent = String(bookings.length);
    document.getElementById("total-users").textContent = String(users.length);
    document.getElementById("total-revenue").textContent = formatMoney(totalRevenue);
    document.getElementById("weekly-revenue").textContent = formatMoney(weeklyRevenue);

    updateBookingStatusCounts(bookings);
    drawChart("booking-chart", days, "bookings", "No bookings in the last 7 days.", false);
    drawChart("revenue-chart", days, "revenue", "No paid bookings in the last 7 days.", true);
    updatePopularMovies(bookings);
    updateRecentBookings(bookings);
  } catch (error) {
    showError(error.message);
  }
}

var menuLinks = document.querySelectorAll(".nav-link");

function setActiveMenuLink(selectedLink) {
  for (var i = 0; i < menuLinks.length; i++) {
    menuLinks[i].classList.remove("active");
    menuLinks[i].removeAttribute("aria-current");
  }

  selectedLink.classList.add("active");
  selectedLink.setAttribute("aria-current", "location");
}

for (var menuIndex = 0; menuIndex < menuLinks.length; menuIndex++) {
  menuLinks[menuIndex].addEventListener("click", function () {
    setActiveMenuLink(this);
  });
}
if (window.location.hash) {
  for (var linkIndex = 0; linkIndex < menuLinks.length; linkIndex++) {
    if (menuLinks[linkIndex].getAttribute("href") === window.location.hash) {
      setActiveMenuLink(menuLinks[linkIndex]);
    }
  }
}

document.getElementById("refresh-dashboard").addEventListener("click", loadDashboard);
loadDashboard();
