let data = [];
const cardContainer = document.querySelector(".card-container");

document.addEventListener("DOMContentLoaded", function () {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((res) => {
      data = res;
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        let starFilled = Math.floor(data[i].rating.rate);
        let starNotFilled = 5 - starFilled;

        let rateDiv = document.createElement("div");
        rateDiv.setAttribute("id", "rate");
        rateDiv.setAttribute("class", "rate");

        // Filled stars
        for (let j = 0; j < starFilled; j++) {
          rateDiv.innerHTML += '<span class="filled">&#9733;</span>';
        }

        // Not filled stars
        for (let j = 0; j < starNotFilled; j++) {
          rateDiv.innerHTML += '<span class="not-filled">&#9734;</span>';
        }

        cardContainer.innerHTML += `
          <div class="card">
            <div class="image">
              <img class="img" src="${data[i].image}" alt="">
            </div>
            <div class="details">
              <div class="title">${data[i].title}</div>
              <div class="category">${data[i].category}</div>
              ${rateDiv.outerHTML}
              <div class="count">Rating Count: ${data[i].rating.count}</div>
            </div>
            <button class="btn">Buy Now</button>
          </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
