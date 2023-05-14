const error = document.querySelector(".error1");
function ResetPassword() {
  //   alert("HELLO THEREE");
  const email = document.getElementById("email").value;

  const csrf = document.querySelector(".csrf").value;
  console.log("HELLO THERE");
  const data = {
    email,
  };

  fetch("http://localhost:2007/api/v1/users/reset", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "csrf-token": csrf, // Make sure the csrfToken variable is properly defined and set
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        // Check the status code, not the string "SUCCESS"
        error.innerHTML = "PASSWORD SENT SUCCESSFULLY!!";
        error.classList.add("error2display");
        alert("PASSWORD SENT SUCCESSFULLY");
        const setTime = setTimeout(() => {
          alert("About to be redirected");
          window.location.href = "http://localhost:2007/Mercado/User/Login";
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
