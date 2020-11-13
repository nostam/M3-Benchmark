const myHeaders = new Headers({
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiZDRiMjRiY2RlMTAwMTc2MTZhOWQiLCJpYXQiOjE2MDUwOTY2MjYsImV4cCI6MTYwNjMwNjIyNn0.wnvHZoGWTVKKmnMosaLbRybRZBimbBtCTwikNc7HA_0",
  "Content-Type": "application/json",
});
let id;
let g;
const url = "https://striveschool-api.herokuapp.com/api/movies/";
const detailsInfo = (obj) => {
  return `<h4>${obj.name}</h4>
      	  <span class="badge badge-pill badge-info d-inline-flex align-self-center" style="white-space:nowrap">${obj.category}</span>
      	  <hr>
      	  <p class="text-left"style="white-space: pre-wrap">${obj.description}</p>
      	  <span class="d-flex mt-auto align-self-end">Last modified at ${obj.updatedAt}</span>
      	  `;
};
const errBadge = (error) = {
  let danger = document.createElement("div");
  danger.classList.add("alert", "alert-danger");
  danger.innerText = error;
  document.getElementsByTagName("h1").appendChild(danger);
}
window.onload = async () => {
  let contentLoadingSpinner = document.getElementById("contentLoadingSpinner");
  contentLoadingSpinner.classList.toggle("d-none");
  let urlParams = new URLSearchParams(window.location.search); // creating a new instance of the URLSearchParams object
  id = urlParams.get("id");
  genre = urlParams.get("g");
  try {
    let response = await fetch(url + genre, {
      method: "GET",
      headers: myHeaders,
    });
    let payload = await response.json();
    if (response.ok) {
      contentLoadingSpinner.classList.toggle("d-none");
      let movie = payload.filter((p) => p["_id"] === id)[0];
      document.getElementById("details").classList.toggle("d-none");
      document.getElementById("image").src = movie.imageUrl;
      document.getElementById("details-info").innerHTML += detailsInfo(movie);
      document.getElementsByClassName(
        "modal-body"
      )[0].innerHTML = `Are you sure you want to delete <strong>${movie.name} from the shelf?</strong>`;
    } else {
      contentLoadingSpinner.classList.toggle("d-none");
      throw Error("ID does not match");
    }
  } catch (error) {
    errBadge(error);
    console.log(error);
  }
};

const handleDelete = async () => {
  try {
    const response = await fetch(url + id, {
      method: "DELETE",
      headers: myHeaders,
    });
    if (response.ok) {
      alert("Product deleted successfully, redirecting back to homepage...");
      location.assign("index.html");
    } else {
      alert("Something went wrong!");
    }
  } catch (error) {
    errBadge(error);
    console.log(error);
  }
};

const handleEdit = () => {
  location.href = "edit.html?id=" + id + "&g=" + genre;
};
