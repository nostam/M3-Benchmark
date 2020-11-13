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
const addToShelf = (p) => {
  // console.log(p);
  let card = document.createElement("div");
  card.classList.add("card", "mx-auto", "my-5");
  card.style.width = "300px";
  card.innerHTML = `
    <img src="${p.imageUrl}" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title d-flex justify-content-between"><span>${p.name}</span><span>${p.brand}</span></h5>
      <p class="card-text">${p.description}</p>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <a href="./detail.html?id=${p._id}" class="btn btn-info">Detail</a>
      <div class="d-flex align-items-center">
        <span>Price: $${p.price}</span>
        <a href="#" class="btn btn-warning ml-2">Buy</a>
      </div>
    </div>`;
  return card;
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
  // let contentLoadingSpinner = document.getElementById("contentLoadingSpinner");
  // contentLoadingSpinner.classList.toggle("d-none");
  const url = "https://striveschool-api.herokuapp.com/api/movies/";
  let shelf = document.querySelector("#shelf");
  // let sortBtn = document.querySelector("#sortBtn");
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: myHeaders,
    });

    let payload = await response.json();
    console.log(payload);
    // if (payload.length > 0) {
    //   payload.sort((a, b) =>
    //     a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0
    //   );
    //   contentLoadingSpinner.classList.toggle("d-none");
    //   document.getElementById("func").classList.toggle("d-none");
    //   sortBtn.addEventListener("click", sortIndex);
    //   payload.forEach((p) => shelf.appendChild(addToShelf(p)));
    //   search(payload);
    // } else {
    //   contentLoadingSpinner.classList.toggle("d-none");
    //   shelf.innerHTML = "<h2>Sorry it's out of stock at the moment</h2>";
    // }
  } catch (error) {
    errBadge(error);
  }
};
