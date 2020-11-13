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

  // input validation
  // let inputs = [...document.querySelectorAll("input")];
  // // inputs.flat(inputs.push([...document.querySelectorAll("textarea")]));
  // if (inputs[3] < 0) {
  //   throw Error("incorrect price");
  // }
  // if (Boolean(inputs.filter((e) => e.value === "").length === 0)) {
  //   console.log("data all set");
  // } else {
  //   throw Error("empty field exists");
  // } //replaced with required tag
  let urlParmas = new URLSearchParams(document.location.search);
  let id = urlParmas.get("id");

  let info = {
    name: document.querySelector("#name").value,
    description: document.querySelector("#description").value,
    category: document.querySelector("#category").value,
    imageUrl: document.querySelector("#imageUrl").value,
  };
  console.log("before submit", info);
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
  }
};

window.onload = async () => {
  let urlParmas = new URLSearchParams(document.location.search);
  let id = urlParmas.get("id");
  if (id) {
    try {
      let response = await fetch(url + id, {
        method: "GET",
        headers: myHeaders,
      });
      let payload = await response.json();
      if (response.ok) {
        document.querySelector(".text-center.mt-5").innerText = "Edit Movie";
        submitBtn.innerText = "Edit Movie";
        document.querySelector("#name").value = payload.name;
        document.querySelector("#description").value = payload.description;
        document.querySelector("#category").value = payload.category;
        document.querySelector("#imageUrl").value = payload.imageUrl;
      } else {
        throw Error("ID does not match");
      }
    } catch (error) {
      errBadge(error);
    }
  }
};
