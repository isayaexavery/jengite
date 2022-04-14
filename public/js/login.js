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
      location.replace("/");
    } else {
      // location.replace("/login");
    }
  } else {
    // location.replace("/login");
  }
};
// const loader = document.querySelector(".loading");
const submitBtn = document.querySelector(".submit-btn");

const email = document.querySelector("#email");
const password = document.querySelector("#password");

let alertMsg = document.querySelector(".alert-msg");

submitBtn.addEventListener("click", () => {
  if (!email.value.length || !password.value.length) {
    showAlert("* Fill all ");
  } else {
    sendData("./login", {
      email: email.value,
      password: password.value,
    });
  }
});

//send to the server
const sendData = async (path, data) => {
  submitBtn.classList.add("loading");
  await fetch(path, {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      processData(response);
    });
};

const processData = (data) => {
  // loader.style.display = null;
  if (data.alert) {
    submitBtn.classList.remove("loading");
    showAlert(data.alert);
  } else if (data.email) {
    //create token
    // console.log(data.email);
    // data.authToken = generateToken(data.email);
    // sessionStorage.user = JSON.stringify(data);
    // window.location.replace("/");;
    localStorage.setItem("sakiti_token", JSON.stringify(data));
    location.replace("/");
  }
};

const showAlert = (msg) => {
  alertMsg.innerHTML = msg;
  alertMsg.classList.add("show");
};
