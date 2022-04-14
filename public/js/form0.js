const loader = document.querySelector(".loading");
const submitBtn = document.querySelector(".login-btn");
const namee = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const number = document.querySelector("#number");
const noficication = document.querySelector("#noficication");

let alertMsg = document.querySelector(".alert-msg");

submitBtn.addEventListener("click", () => {
  if (!namee.value.length || !email.value.length || !number.value.length) {
    showAlert("* Fill all ");
  } else if (namee.value.length < 3) {
    showAlert("* name  must be 3 letters long");
  } else if (!email.value.length) {
    showAlert("enter your email");
  } else if (password.value.length < 8) {
    showAlert("password must be 8 letters long");
  } else if (!number.value.length) {
    showAlert("enter your phone number");
  } else if (password.value !== password2.value) {
    showAlert(`Passwords must match`);
  } else {
    loader.style.display = "block";
    submitBtn.style.display = "none";
    sendData("./signup", {
      name: namee.value,
      email: email.value,
      password: password.value,
      number: number.value,
      recruiter: false,
    });
  }
});

//send to the server
const sendData = (path, data) => {
  fetch(path, {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      processData(response);
    });
};

const processData = (data) => {
  loader.style.display = null;
  if (data.alert) {
    showAlert(data.alert);
  } else if (data.name) {
    //create token
    // console.log(data.email);
    // data.authToken = generateToken(data.email);
    // sessionStorage.user = JSON.stringify(data);
    window.location.replace("/");
  }
};

const showAlert = (msg) => {
  alertMsg.innerHTML = msg;

  alertMsg.classList.add("show");
};
