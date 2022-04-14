const token = JSON.parse(localStorage.getItem("sakiti_token") || null);
if (token) {
  console.log(token);
  let base64Url = token.sakiti_token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  if (JSON.parse(jsonPayload).email === token.email) {
    location.replace("/dashboard");
  }
}
let forgotPassToken;
if (location.pathname !== "/forgotpassword") {
  // location.pathname.split("-").pop()
  forgotPassToken = decodeURI(
    location.pathname.split("/forgotpassword-").pop()
  );

  console.log(forgotPassToken, compareToken(forgotPassToken).id);

  const forgotpassContainer = document.querySelector(".forgotpass");
  forgotpassContainer.innerHTML += `<div class="container">
  <h2>Reset Your Account</h2>
  
  <div class="login-sign-in">
  <ul>
      <li>Enter your new password</li>
  </ul>
  </div>
      <div class="form-group">
          <input type="password" class="form-control" id="password" name="password" placeholder="Enter Password">
      </div>
      <div class="form-group">
          <input type="password" class="form-control" id="password2" name="password2" placeholder="Repeat your password">
      </div>
    
  <p class="alert-msg"></p>
  
  <div class="login-sign-in">
        
      <div class="text-center">
          <button type="submit" class="btn login-btn">Submit</button>
      </div>
  </div>
  </div>`;
} else {
  forgotpassContainer.innerHTML += `<div class="container">
  <h2>Reset Your Account</h2>
  
  <div class="login-sign-in">
  <ul>
      <li>Enter your email and we will send a link for reseting your password</li>
  </ul>
  </div>
      <div class="form-group">
          <input type="text" class="form-control" id="email" name="email" placeholder="Email">
      </div>
    
  <p class="alert-msg"></p>
  
  <div class="login-sign-in">
      <ul>
          <li>Don’t Have Account ?</li>
          <li>
              <a href="/signup">Sign Up Here</a>
          </li>
      </ul>
  
      <div class="text-center">
          <button type="submit" class="btn login-btn">Reset Password</button>
      </div>
  </div>
  </div>`;
}

const email = document.querySelector("#email");
const passowrd = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const alertMsg = document.querySelector(".alert-msg");
const submitBtn = document.querySelector(".login-btn");
const resetBtn = document.querySelector(".reset-btn");

submitBtn.addEventListener("click", () => {
  // console.log("email..." + email.value);
  alertMsg.classList.remove("show");
  if (forgotPassToken) {
    if (passowrd.value.length < 6) {
      // alertMsg.innerHTML += "Fill your password please";
      // alertMsg.classList.add("show");
      showAlert("Password must have more than 6 characters");
    } else if (passowrd.value !== password2.value) {
      // alertMsg.innerHTML += "Passowrds do not match";
      // alertMsg.classList.add("show");
      showAlert("Passowrds do not match");
    } else {
      console.log(forgotPassToken, passowrd.value);

      fetch("/forgotpassword-" + forgotPassToken, {
        method: "post",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          token: forgotPassToken,
          password: passowrd.value,
          email: compareToken(forgotPassToken).id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            console.log("success");
            location.replace("/login");
          } else {
            console.log("Not success");
          }
        });
    }
  } else {
    if (!email.value.length) {
      alertMsg.innerHTML += "Fill your email please";
      alertMsg.classList.add("show");
    } else {
      fetch("/forgotpassword", {
        method: "post",
        headers: new Headers({ "Content-Type": "application/json" }),
        body: JSON.stringify({ email: email.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success == true) {
            localStorage.setItem("email_token", JSON.stringify(data.email));
          } else {
            console.log("Not success" + data.message);
          }
        });
    }
  }
});

const showAlert = (msg) => {
  alertMsg.innerHTML = msg;

  alertMsg.classList.add("show");
};
// submitBtn.addEventListener("click", () => {
//   console.log("reset..." + email.value);
//   // if (!email.value.length) {
//   //   alertMsg.innerHTML += "Fill your email please";
//   //   alertMsg.classList.add("show");
//   // } else {
//   //   fetch("/forgotpassword", {
//   //     method: "post",
//   //     headers: new Headers({ "Content-Type": "application/json" }),
//   //     body: JSON.stringify({ email: email.value }),
//   //   })
//   //     .then((res) => res.json())
//   //     .then((data) => {
//   //       if (data.message == "success") {
//   //         console.log("success - " + data.token);
//   //       } else {
//   //         console.log("Not success" + data.message);
//   //       }
//   //     });
//   // }
// });
