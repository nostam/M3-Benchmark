const myHeaders = new Headers({
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiZDRiMjRiY2RlMTAwMTc2MTZhOWQiLCJpYXQiOjE2MDUwOTY2MjYsImV4cCI6MTYwNjMwNjIyNn0.wnvHZoGWTVKKmnMosaLbRybRZBimbBtCTwikNc7HA_0",
  "Content-Type": "application/json",
});

const url = "https://striveschool-api.herokuapp.com/api/movies/";

const errBadge = (msg) => {
  let danger = document.createElement("div");
  danger.classList.add(
    "alert",
    "alert-danger",
    "mt-2",
    "col-md-6",
    "offset-md-3"
  );
  danger.innerText = msg;
  document.querySelector("h5").append(danger);
};
const submitBtn = document.querySelector("#submitBtn span:last-of-type");
const handleSubmit = (e) => {
  e.preventDefault(); // preventing the default browser event handling
  document.querySelector(".alert-danger")
    ? document.querySelector(".alert-danger").remove()
    : document.getElementById("category").selectedIndex !== 0
    ? submitMovie()
    : errBadge("Please select a movie category");
};

const submitMovie = async () => {
  let spinner = document.querySelector("#loadingSpinner");
  spinner.classList.toggle("d-none"); // showing the spinner
  submitBtn.innerText = "Submitting...";

  let urlParmas = new URLSearchParams(document.location.search);
  let id = urlParmas.get("id");
  let cat = document.getElementById("category");
  let info = {
    name: document.querySelector("#name").value,
    description: document.querySelector("#description").value,
    category: cat.options[cat.selectedIndex].text.toLowerCase(),
    imageUrl: document.querySelector("#imageUrl").value,
  };

  try {
    let response;
    if (id) {
      response = await fetch(url + id, {
        method: "PUT",
        body: JSON.stringify(info),
        headers: myHeaders,
      });
    } else {
      response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(info),
        headers: myHeaders,
      });
    }
    if (response.ok) {
      spinner.classList.toggle("d-none");
      submitBtn.innerText = "Success!";
      alert(
        `Movie ${
          id ? "updated" : "created"
        } successfully, redirecting back to homepage...`
      );
      location.assign("index.html");
    } else {
      spinner.classList.toggle("d-none");
      submitBtn.innerText = "Submit Movie";
      errBadge("unexpected error");
    }
  } catch (error) {
    spinner.classList.toggle("d-none");
    submitBtn.innerText = "Submit Movie";
    errBadge(error);
    console.log(error);
  }
};

window.onload = async () => {
  let urlParams = new URLSearchParams(window.location.search); // creating a new instance of the URLSearchParams object
  id = urlParams.get("id");
  genre = urlParams.get("g");
  if (id && genre) {
    try {
      let response = await fetch(url + genre, {
        method: "GET",
        headers: myHeaders,
      });
      let payload = await response.json();
      if (response.ok) {
        let movie = payload.filter((p) => p["_id"] === id)[0];
        console.log(movie);
        document.querySelector(".text-center.mt-5").innerText = "Edit Movie";
        submitBtn.innerText = "Edit Movie";
        document.querySelector("#name").value = movie.name;
        document.querySelector("#description").value = movie.description;
        let cat = document.querySelector("#category");
        let arr = cat.options;
        let g;
        for (option of arr) {
          if (option.value.toLowerCase() === genre) {
            g = option.index;
          }
        }
        document.querySelector("#category").selectedIndex = g;
        document.querySelector("#imageUrl").value = movie.imageUrl;
      } else {
        throw Error("ID does not match");
      }
    } catch (error) {
      errBadge(error);
      console.log(error);
    }
  }
};
