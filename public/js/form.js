window.onload = () => {
  const token = JSON.parse(localStorage.getItem("sakiti_token"));

  if (token) {
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

    console.log(token);
    if (JSON.parse(jsonPayload).email === token.email) {
      location.replace("/dashboard");
    } else {
      // location.replace("/login");
    }
  } else {
    // location.replace("/login");
  }
};

const submitBtn = document.querySelector(".create-btn");
const namee = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const number = document.querySelector("#number");
const noficication = document.querySelector("#noficication");

let alertMsg = document.querySelector(".alert-msg");

let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
submitBtn.addEventListener("click", () => {
  if (!namee.value.length || !email.value.length || !number.value.length) {
    showAlert("* Fill all ");
  } else if (namee.value.length < 3) {
    showAlert("* name  must be 3 letters long");
  } else if (!email.value.length || !regex.test(email.value)) {
    showAlert("check your your email");
  } else if (password.value.length < 8) {
    showAlert("password must be 8 letters long");
  } else if (!number.value.length) {
    showAlert("enter your phone number");
  } else if (password.value !== password2.value) {
    showAlert(`Passwords must match`);
  } else {
    sendData("./signup", {
      name: namee.value,
      email: email.value,
      password: password.value,
      number: number.value,
      resetLink: "",
      recruiter: false,
    });
  }
});

//send to the server
const sendData = async (path, data) => {
  showAlert("Wait,  Account is being created....");
  await fetch(path, {
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
  if (data.alert) {
    showAlert(data.alert);
  } else if (data.name) {
    //create token
    // console.log(data.email);
    // data.authToken = generateToken(data.email);
    // sessionStorage.user = JSON.stringify(data);
    // const token = jwt.sign(data, JWT_SECRET );
    // console.log(data);

    localStorage.setItem("sakiti_token", JSON.stringify(data));
    location.replace("/");
  }
};

const showAlert = (msg) => {
  alertMsg.innerHTML = msg;

  alertMsg.classList.add("show");
};
