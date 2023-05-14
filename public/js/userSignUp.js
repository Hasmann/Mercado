const error = document.querySelector(".error1");
const togglePassword = document.querySelector("#passwordToggle");
const password = document.querySelectorAll(".passwordchange");
console.log(password);
togglePassword.addEventListener("click", function (e) {
  for (let i = 0; i < password.length; i++) {
    // toggle the type attribute
    if (password[i].getAttribute("type") === "password") {
      password[i].setAttribute("type", "text");
    } else {
      password[i].setAttribute("type", "password");
    }
  }
  // toggle the eye slash icon
  this.classList.toggle("fa-eye-slash");
});

function userSignUp() {
  alert("HELLO THEREE");
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("passwordId").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  const csrf = document.querySelector(".csrf").value;
  console.log("HELLO THERE");
  const data = {
    fullName,
    email,
    password,
    passwordConfirm,
  };

  fetch("http://localhost:2007/api/v1/user/signUp", {
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
        alert("User SIGNED UP SUCCESSFULLY!!");
        error.innerHTML = "USER SIGNED-UP SUCCESSFULLY!!";
        error.classList.add("error2display");
        alert("USER SIGNED-UP SUCCESSFULLY");
        const setTime = setTimeout(() => {
          alert("About to be redirected");
          window.location.href = "http://localhost:2007/Mercado/User/signUp";
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
