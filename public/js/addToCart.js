const addToCart = document.querySelector(".addToCart");

addToCart.addEventListener("click", function (e) {
  e.preventDefault();
  alert("ADD-TO-CART");
  const productId = document.querySelector(".productId").value;
  const csrf = document.querySelector(".csrf").value;
  console.log("HELLO THERE");
  const data = {
    productId,
  };
  console.log(data);

  // Use a relative URL and define the base URL as a constant

  fetch("http://localhost:2007/api/v1/Mercado/User/addToCart", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "csrf-token": csrf, // Make sure the csrfToken variable is properly defined and set
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 201) {
        // Check the status code, not the string "SUCCESS"
        alert("Item Added To Cart");
        const setTime = setTimeout(() => {
          alert("About to be redirected");
          location.reload();
        }, 5000);
        return response.json();
      } else {
        return response.json();
        // throw new Error("Login failed"); // Throw an error to be caught by the catch() block
      }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
});
