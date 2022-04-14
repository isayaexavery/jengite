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

  if (JSON.parse(jsonPayload).email === token.email) {
  } else {
    location.replace("/login");
  }
} else {
  location.replace("/login");
}

const companyName = document.querySelector("#company-name");
const jobLocation = document.querySelector("#location");
const contact = document.querySelector("#contact");
const jobDescr = document.querySelector("#your_message");
const submitBtn = document.querySelector(".create-ac-btn");
const uploadImage = document.querySelector(".fileupload");
let alertMsg = document.querySelector(".alert-msg");

let imagePath = "";

uploadImage.addEventListener("change", async () => {
  const file = uploadImage.files[0];
  let imageUrl;
  console.log(file.type);
  // var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (file.type === "image/png") {
    await fetch("/s3url")
      .then((res) => res.json())
      .then((url) => {
        fetch(url, {
          method: "PUT",
          headers: new Headers({ "Content-Type": "nulpart/form-data" }),
          body: file,
        }),
          then((res) => {
            imageUrl = url.split("?")[0];
            imagePath = imageUrl;
            console.log(imageUrl);
          });
      });
  } else {
    console.log("Imge only");
  }
});

submitBtn.addEventListener("click", () => {
  let myJobType;
  if (
    !companyName.value.length ||
    !jobLocation.value.length ||
    !jobDescr.value.length ||
    !contact.value.length
  ) {
    alertMsg.innerHTML = "* Fill all...";

    alertMsg.classList.add("show");
  } else {
    sendData("./post-job", {
      company: companyName.value,
      location: jobLocation.value,
      description: jobDescr.value,
      contact: contact.value,
      recruiterEmail: token.email,
    });
  }
});

const sendData = async (path, data) => {
  // console.log(data);
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
  // loader.style.display = null;
  if (data.alert) {
    showAlert(data.alert);
  } else if (data.companyName) {
    localStorage.setItem("sakiti_token", JSON.stringify(data));
    location.replace("/");
  } else if (data == true) {
    // recruiter page
    // let user = token.recruiter;
    // user.recruiter = true;
    // localStorage.setItem("sakiti_token", JSON.stringify(data));
    // location.reload();

    token.recruiter = true;
    localStorage.setItem("sakiti_token", JSON.stringify(token));
    location.reload();
  }
};

const showAlert = (msg) => {
  alertMsg.innerHTML = msg;

  alertMsg.classList.add("show");
};
