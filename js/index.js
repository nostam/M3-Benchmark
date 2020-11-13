const myHeaders = new Headers({
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiZDRiMjRiY2RlMTAwMTc2MTZhOWQiLCJpYXQiOjE2MDUwOTY2MjYsImV4cCI6MTYwNjMwNjIyNn0.wnvHZoGWTVKKmnMosaLbRybRZBimbBtCTwikNc7HA_0",
});
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
  document.getElementById("navbar").append(danger);
};
const addToShelf = (p, genre) => {
  console.log(p);
  let movie = document.createElement("div");
  movie.classList.add("col", "mx-2", "my-5");
  movie.innerHTML = `
    <div class="col mb-3 mb-lg-0 px-1">
    <div class="strive-card position-relative">
      <img class="movie-img rounded" src="${p.imageUrl}" />
      <div class="infos-container">
        <div class="infos-content">
          <div class="d-flex mb-3">
            <div class="play-btn gradient"></div>
            <h6 class="mt-2 ml-2">Play</h6>
            <span class="ml-auto plus">
              <!-- <i class="fa fa-plus fa-lg" aria-hidden="true"></i> -->
            </span>
          </div>
          <a href="detail.html?=id${p._id}&g=${genre}"><h6>${p.name}</h6></a>
          <p>
            ${p.description}
          </p>
          <div class="movie-footer">
            <span class="mr-2"></span>
            <i class="fa fa-address-card fa-lg mr-2"></i>
            <i class="fa fa-calendar-check-o fa-lg"></i>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  return movie;
};
const handleGenre = async (genre = anime) => {
  console.log(genre);
  let contentLoadingSpinner = document.getElementById("contentLoadingSpinner");
  const url = "https://striveschool-api.herokuapp.com/api/movies/" + genre;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: myHeaders,
    });
    let payload = await response.json();
    if (payload.length > 0) {
      payload.sort((a, b) =>
        a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0
      );
      // document.getElementById("func").classList.toggle("d-none");
      // sortBtn.addEventListener("click", sortIndex);
      let newGenreTitle = document.createElement("h3");
      newGenreTitle.innerHTML = `<span class="mt-4 text-white text-capitalize">${genre}</span>`;
      let newRow = document.createElement("div");
      newRow.classList.add(
        "row",
        "no-gutters",
        "row-cols-1",
        "row-cols-sm-2",
        "row-cols-md-3",
        "row-cols-lg-4",
        "mb-4",
        "justify-content-start"
      );
      shelf.appendChild(newGenreTitle);
      payload.forEach((p) => newRow.appendChild(addToShelf(p, genre)));
      shelf.appendChild(newRow);
    } else {
      contentLoadingSpinner.classList.toggle("d-none");
      shelf.innerHTML =
        "<h2 class='text-white-50'>Sorry something went wrong</h2>";
    }
  } catch (error) {
    errBadge(error);
    console.log(error);
  }
};
const search = (payload, criteria = "name") => {
  let input = document.querySelector(".form-control");
  let result = [];
  let cards = [...document.getElementsByClassName("card")];
  input.addEventListener("input", function (e) {
    if (input.value.length > 0) {
      // console.log("searching", input.value);
      // console.log(payload);
      result = payload.filter((obj) =>
        obj[criteria]
          .valueOf()
          .toLowerCase()
          .includes(input.value.toLowerCase())
      );
      for (let card of cards) {
        card.classList.remove("searchMatched");
      }
      // console.log(
      //   result,
      //   cards.map((e) => e.className)
      // );
      for (let card of cards) {
        for (let filtered of result) {
          if (filtered["_id"] === card["id"]) {
            card.classList.add("searchMatched");
          }
        }
        if (card.className.match("searchMatched")) {
          card.classList.remove("d-none");
        } else {
          card.classList.add("d-none");
        }
      }
    } else {
      for (let card of cards) {
        card.classList.remove("d-none"); // from searching back to whole index
      }
    }
  });
};
let num1 = 1;
let num2 = -1;
const sortIndex = function (payload, option) {
  let shelf = document.querySelector("#shelf");
  let itemsArr = Array.from(shelf.children);

  itemsArr
    .sort((a, b) =>
      a.innerText.substr(0, 1).toLowerCase() >
      b.innerText.substr(0, 1).toLowerCase()
        ? num1
        : num2
    )
    .map((list) => shelf.append(list));

  let tmp = num1;
  num1 = num2;
  num2 = tmp;
};

window.onload = async () => {
  let contentLoadingSpinner = document.getElementById("contentLoadingSpinner");
  contentLoadingSpinner.classList.toggle("d-none");
  const url = "https://striveschool-api.herokuapp.com/api/movies/";
  let shelf = document.querySelector("#shelf");
  // let sortBtn = document.querySelector("#sortBtn");
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: myHeaders,
    });
    let payload = await response.json();
    if (payload.length > 0) {
      payload.sort((a, b) => (a > b ? -1 : a < b ? 1 : 0));
      contentLoadingSpinner.classList.toggle("d-none");
      for (let genre of payload) {
        handleGenre(genre);
      }
    } else {
      contentLoadingSpinner.classList.toggle("d-none");
      shelf.innerHTML =
        "<h2 class='text-white-50'>Sorry something went wrong</h2>";
    }
  } catch (error) {
    errBadge(error);
  }
};
