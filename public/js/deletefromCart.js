function deleteFromCart() {
  alert("HELLOOO");
  const csrf = document.querySelector(".csrf").value;
  const productId = document.querySelector(".productId").value;
  fetch("http://localhost:2007/api/v1/Mercado/User/cart-delete-item", {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId: productId }),
  })
    .then((response) => {
      if (response.status === 200) {
        alert("deleted successfully");
        // Check the status code, not the string "SUCCESS"
        alert("Item DELETED FROM CART To Cart");
        alert("About to be redirected");
        window.location.href = "http://localhost:2007/Mercado/User/cart";
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
}
