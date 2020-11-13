const myHeaders = new Headers({
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiZDRiMjRiY2RlMTAwMTc2MTZhOWQiLCJpYXQiOjE2MDUwOTY2MjYsImV4cCI6MTYwNjMwNjIyNn0.wnvHZoGWTVKKmnMosaLbRybRZBimbBtCTwikNc7HA_0",
  "Content-Type": "application/json",
});
let id;
const url = "https://striveschool-api.herokuapp.com/api/product/";
const detailsInfo = (product) => {
  return `<h4>${product.name}</h4>
      	  <h5>Brand: ${product.brand}</h5>
      	  <hr>
      	  <h6>${product.description}</h6>
      	  <p class="d-flex mt-auto align-self-end">Last modified at ${product.updatedAt}</p>
      	  `;
};

window.onload = async () => {
  let contentLoadingSpinner = document.getElementById("contentLoadingSpinner");
  contentLoadingSpinner.classList.toggle("d-none");
  let urlParams = new URLSearchParams(window.location.search); // creating a new instance of the URLSearchParams object
  id = urlParams.get("id"); // saving the id retrieved from the url address bar
  try {
    let response = await fetch(url + id, {
      method: "GET",
      headers: myHeaders,
    });
    let product = await response.json();
    if (response.ok) {
      contentLoadingSpinner.classList.toggle("d-none");
      document.getElementById("details").classList.toggle("d-none");
      document.getElementById("productImg").src = product.imageUrl;
      document.getElementById("details-info").innerHTML += detailsInfo(product);
      document.getElementsByClassName(
        "modal-body"
      )[0].innerHTML = `Are you sure you want to delete <strong>${product.name} from the shelf?</strong>`;
    } else {
      contentLoadingSpinner.classList.toggle("d-none");
      throw Error("ID does not match");
    }
  } catch (error) {
    let danger = document.createElement("div");
    danger.classList.add("alert", "alert-danger");
    danger.innerText = error;
    document.getElementsByTagName("h1").appendChild(danger);
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
    let danger = document.createElement("div");
    danger.classList.add("alert", "alert-danger");
    danger.innerText = error;
    document.getElementsByTagName("h1").appendChild(danger);
  }
};

const handleEdit = () => {
  location.href = "edit.html?id=" + id;
};
