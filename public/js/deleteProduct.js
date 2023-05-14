const error = document.querySelector(".error1");
const togglePassword = document.querySelector("#passwordToggle");
const password = document.querySelectorAll(".passwordchange");

function deleteproduct() {
  alert("HELLO THEREE");
  const productId = document.getElementById("productId").value;
  const csrf = document.querySelector(".csrf").value;
  console.log("HELLO THERE");
  const data = {
    productId,
  };

  fetch("http://localhost:2007/api/v1/Merchant/delete-product", {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "csrf-token": csrf, // Make sure the csrfToken variable is properly defined and set
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        // Check the status code, not the string "SUCCESS"
        alert("PRODUCT DELETED SUCCESSFULLY!!");
        error.innerHTML = "PRODUCT DELETED SUCCESSFULLY!!";
        error.classList.add("error2display");
        alert("PRODUCT DELETED SUCCESSFULLY!!");
        const setTime = setTimeout(() => {
          alert("About to be redirected");
          window.location.href =
            "http://localhost:2007/Mercado/Merchant/allProducts";
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
}
