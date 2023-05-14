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

//gotten from w3 schools
let x, i, j, l, ll, selElmnt, a, b, c;
/*look for any elements with the class "selectCustom":*/
x = document.getElementsByClassName("selectCustom");
l = x.length;
for (i = 0; i < l; i++) {
  selElmnt = x[i].getElementsByTagName("select")[0];
  ll = selElmnt.length;
  /*for each element, create a new DIV that will act as the selected item:*/
  a = document.createElement("DIV");
  a.setAttribute("class", "select-selected");
  a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  x[i].appendChild(a);
  /*for each element, create a new DIV that will contain the option list:*/
  b = document.createElement("DIV");
  b.setAttribute("class", "select-items select-hide");
  for (j = 1; j < ll; j++) {
    /*for each option in the original select element,
    create a new DIV that will act as an option item:*/
    c = document.createElement("DIV");
    c.innerHTML = selElmnt.options[j].innerHTML;
    c.addEventListener("click", function (e) {
      /*when an item is clicked, update the original select box,
        and the selected item:*/
      var y, i, k, s, h, sl, yl;
      s = this.parentNode.parentNode.getElementsByTagName("select")[0];
      sl = s.length;
      h = this.parentNode.previousSibling;
      for (i = 0; i < sl; i++) {
        if (s.options[i].innerHTML == this.innerHTML) {
          s.selectedIndex = i;
          h.innerHTML = this.innerHTML;
          y = this.parentNode.getElementsByClassName("same-as-selected");
          yl = y.length;
          for (k = 0; k < yl; k++) {
            y[k].removeAttribute("class");
          }
          this.setAttribute("class", "same-as-selected");
          break;
        }
      }
      h.click();
    });
    b.appendChild(c);
  }
  x[i].appendChild(b);
  a.addEventListener("click", function (e) {
    /*when the select box is clicked, close any other select boxes,
      and open/close the current select box:*/
    e.stopPropagation();
    closeAllSelect(this);
    this.nextSibling.classList.toggle("select-hide");
    this.classList.toggle("select-arrow-active");
  });
}
function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x,
    y,
    i,
    xl,
    yl,
    arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;
  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/
document.addEventListener("click", closeAllSelect);

//consuming the merchantSignUp API

function merchantSignUp() {
  alert("HELLO THEREE");
  const fullName = document.getElementById("fullName").value;
  const VirtualStoreName = document.getElementById("VirtualStoreName").value;
  const Category = document.getElementById("Category").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("passwordId").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  const csrf = document.querySelector(".csrf").value;
  console.log("HELLO THERE");
  const data = {
    fullName,
    VirtualStoreName,
    Category,
    email,
    password,
    passwordConfirm,
  };

  fetch("http://localhost:2007/api/v1/merchant/signUp", {
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
        alert("MERCHANT SIGNED UP SUCCESSFULLY!!");
        error.innerHTML = "MERCHANT SIGNED UP SUCCESSFULLY!!";
        error.classList.add("error2display");
        alert("MERCHANT SIGNED SUCCESSFULLY");
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
