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

const jobTitle = document.querySelector("#job-title");
const jobCategory = document.querySelector("#job-category");
const companyName = document.querySelector("#company-name");
const jobLocation = document.querySelector("#location");
const jobType = document.getElementsByName("inlineRadioOptions");
const jobDescr = document.querySelector("#your_message");
const submitBtn = document.querySelector(".create-ac-btn");
let alertMsg = document.querySelector(".alert-msg");

submitBtn.addEventListener("click", () => {
  let myJobType;
  if (
    !jobTitle.value.length ||
    !jobCategory.value.length ||
    !companyName.value.length ||
    !jobLocation.value.length ||
    !jobDescr.value.length
  ) {
    alertMsg.innerHTML = "* Fill all...";

    alertMsg.classList.add("show");
  } else {
    for (i = 0; i < jobType.length; i++) {
      if (jobType[i].checked) {
        // console.log("job type - " + jobType[i].value);
        myJobType = jobType[i].value;
      }
    }

    sendData("./post-job", {
      job: jobTitle.value,
      category: jobCategory.value,
      company: companyName.value,
      location: jobLocation.value,
      description: jobDescr.value,
      jobType: myJobType,
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
