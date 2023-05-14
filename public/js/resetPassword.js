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

function resetPassword() {
  //   alert("HELLO THEREE");
  const resetToken = window.location.href.split("/")[6]; // "http://www.example.com/path/to/page?param1=value1&param2=value2"

  const password = document.getElementById("passwordId").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  const csrf = document.querySelector(".csrf").value;
  console.log(csrf);
  console.log("HELLO THERE");
  const data = {
    password,
    passwordConfirm,
  };

  fetch(`http://127.0.0.1:2007/api/v1/users/reset/${resetToken}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "csrf-token": csrf, // Make sure the csrfToken variable is properly defined and set
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status == 200) {
        alert("PASSWORD RESET SUCCESSFULLY");
        error.innerHTML = "PASSWORD RESET SUCCESSFULLY!!";
        error.classList.add("error2display");

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
