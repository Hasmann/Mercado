const error = document.querySelector(".error1");
function userLogin(btn) {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const csrf = document.querySelector(".csrf").value;
  console.log("HELLO THERE");
  const data = {
    email,
    password,
  };

  fetch("http://localhost:2007/api/v1/user/userLogin", {
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
        error.innerHTML = "LOGGED IN SUCCESSFULLY!!";
        swal("Good job!", "You clicked the button!", "success");
        error.classList.add("error2display");
        alert("LOGGED IN SUCCESSFULLY");
        const setTime = setTimeout(() => {
          alert("About to be redirected");
          window.location.href = "http://localhost:2007/Mercado/User/Login";
        }, 5000);
        swal("Good job!", "You clicked the button!", "success");
        alert("LOGGED IN!!");
        location.reload();

        return response.json();
      } else {
        swal("Login Failed", `Incorrect Email Or Password`, "error");
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
function logout() {
  const csrf = document.querySelector(".csrf").value;

  fetch("http://localhost:2007/api/v1/user/logout", {
    method: "POST",
    headers: {
      "csrf-token": csrf, // Make sure the csrfToken variable is properly defined and set
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        // Check the status code, not the string "SUCCESS"
        alert("LOGGED OUT!!");
        location.reload();

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
