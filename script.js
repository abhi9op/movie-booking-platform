// Mobile Menu

function toggleMenu() {

    const navLinks = document.getElementById("navLinks");

    navLinks.classList.toggle("active");

}


// Book Movie

function bookMovie(movieName) {

    alert(
        "You selected: " + movieName +
        "\n\nNext step: Select Cinema and Show Time."
    );

}


// Search Movies

function searchMovies() {

    const searchText =
        document.getElementById("movieSearch").value.toLowerCase();

    const movies =
        document.querySelectorAll(".movie-card");

    movies.forEach(function(movie) {

        const movieName =
            movie.getAttribute("data-name").toLowerCase();

        if (movieName.includes(searchText)) {

            movie.style.display = "block";

        } else {

            movie.style.display = "none";

        }

    });

}


// Find Movie

function findMovie() {

    const city =
        document.getElementById("city").value;

    const date =
        document.getElementById("date").value;

    const movie =
        document.getElementById("movieSelect").value;


    if (city === "" || date === "" || movie === "") {

        alert("Please select City, Date and Movie.");

        return;

    }


    alert(
        "Searching for:\n\n" +
        movie +
        "\nCity: " +
        city +
        "\nDate: " +
        date
    );

}


// Trailer

function openTrailer() {

    document.getElementById("trailerModal").style.display = "flex";

}


function closeTrailer() {

    document.getElementById("trailerModal").style.display = "none";

}


// Copy Coupon

function copyCoupon() {

    navigator.clipboard.writeText("CINE20");

    alert("Coupon code CINE20 copied!");

}


// View All Movies

function showAllMovies() {

    const movies =
        document.querySelectorAll(".movie-card");

    movies.forEach(function(movie) {

        movie.style.display = "block";

    });

    document.getElementById("movieSearch").value = "";

}