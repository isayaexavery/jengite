// const token = JSON.parse(localStorage.getItem("sakiti_token"));

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
const jobLocation = document.querySelector("#job-location");
const jobDescr = document.querySelector("#your_message");
const jobRequirements = document.querySelector("#requirements");
const jobEducation = document.querySelector("#education");
const jobType = document.getElementsByName("inlineRadioOptions");
const howToApply = document.querySelector("#how-apply");
const howToApplyLink = document.querySelector("#how-apply-link");

const companyName = document.querySelector("#company-name");
const companyLocation = document.querySelector("#company-location");
const companyWebsite = document.querySelector("#company-website");
// const phone = document.querySelector("#phone");
// const companyEmail = document.querySelector("#email");

const submitBtn = document.querySelector(".create-ac-btn");
let alertMsg = document.querySelector(".alert-msg");

let jobId = null;

if (jobId) {
  console.log("check job " + jobId);
}

let uploadImage = document.querySelector("#file");
let imagePath = "";

// uploadImage.addEventListener("change", (e) => {
//   // let imgSrc = URL.createObjectURL(e.target.files[0]);
//   let input = e.target;
//   let reader;
//   if (input.files && input.files[0]) {
//     // reader.onload = function (e) {
//     console.log(URL.createObjectURL(input.files[0]));

//     fetch("/upload", {
//       method: "post",
//       headers: new Headers({ "Content-Type": "application/json" }),
//       body: JSON.stringify({
//         path: URL.createObjectURL(input.files[0]),
//         filename: "companyimg",
//       }),
//     });
//     //   .then((res) => res.json())
//     //   .then((response) => {
//     //     console.log(response);
//     //   });
//     // };

//     console.log(input.files[0]);
//     // console.log(typeof reader.readAsDataURL(input.files[0]));
//   }

//   // if (file.type.split("/")[0] === "image") {
//   //   imagePath = URL.createObjectURL(file);

//   //   // fetch("/s3url")
//   //   //   .then((res) => res.json())
//   //   //   .then((url) => {
//   //   //     fetch(url, {
//   //   //       method: "PUT",
//   //   //       headers: new Headers({ "Content-Type": "multipart/formdata" }),
//   //   //       body: imagePath,
//   //   //     }).then((res) => {
//   //   //       console.log(url.split("?")[0]);
//   //   //     });
//   //   //   });
//   //   // console.log(imageUploadedUrl(file));
//   // } else {
//   //   console.log("not image");
//   // }
// });

// // fetch("/s3url")
// //   .then((res) => res.json())
// //   .then((url) => console.log(url));

// // const loginBtn = document.getElementById("login-btn");

// const imageUploadedUrl = async (img) => {
//   await fetch("/s3url")
//     .then((res) => res.json())
//     .then((url) => {
//       fetch(url, {
//         method: "PUT",
//         headers: new Headers({ "Content-Type": "multipart/formdata" }),
//         body: img,
//       }).then((res) => {
//         return url.split("?")[0];
//       });
//     });
// };

submitBtn.addEventListener("click", () => {
  // console.log(logoUrl);

  submitBtn.classList.add("loading");
  let myJobType;
  if (
    !jobTitle.value.length ||
    !jobLocation.value.length ||
    !jobDescr.value.length ||
    !companyName.value.length ||
    !companyLocation.value.length ||
    !howToApply.value.length
  ) {
    alertMsg.innerHTML = "Areas with * must be filled...";

    alertMsg.classList.add("show");
    submitBtn.classList.remove("loading");
  } else {
    for (i = 0; i < jobType.length; i++) {
      if (jobType[i].checked) {
        // console.log("job type - " + jobType[i].value);
        myJobType = jobType[i].value;
      }
    }
    //  if(jobId){
    //    data.id = jobId;
    //  }

    let companyWeb = null;
    let applyLink = null;

    if (companyWebsite.value.length) {
      companyWeb = companyWebsite.value;
    }

    if (howToApplyLink.value.length) {
      applyLink = howToApplyLink.value;
    }

    sendData("./post-job", {
      title: jobTitle.value,
      jobLocation: jobLocation.value,
      jobDescr: jobDescr.value,
      jobType: myJobType,
      company: companyName.value,
      companyLocation: companyLocation.value,
      companyWebsite: companyWeb,
      recruiterEmail: token.email,
      jobRequirements: jobRequirements.value,
      jobEducation: jobEducation.value,
      howToApply: howToApply.value,
      howToApplyLink: applyLink,
      id: jobId,
      timeStamp: Date.now(),
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
    submitBtn.classList.remove("loading");
    localStorage.setItem("sakiti_token", JSON.stringify(data));
    location.replace("/success");
  } else if (data == true) {
    submitBtn.classList.remove("loading");
    // recruiter page
    // let user = token.recruiter;
    // user.recruiter = true;
    // localStorage.setItem("sakiti_token", JSON.stringify(data));
    // location.reload();

    token.recruiter = true;
    localStorage.setItem("sakiti_token", JSON.stringify(token));
    location.replace("/dashboard-employer");
  }
};

const showAlert = (msg) => {
  alertMsg.innerHTML = msg;

  alertMsg.classList.add("show");
};

const setFormData = (data) => {
  jobTitle.value = data.title;
  jobLocation.value = data.jobLocation;
  companyName.value = data.company;
  jobDescr.value = data.jobDescr;
  companyLocation.value = data.companyLocation;
  jobDescr.value = data.description;
  jobDescr.value = data.jobDescr;
  companyWebsite.value = data.companyWebsite;
  jobRequirements.value = data.jobRequirements;
  jobEducation.value = data.jobEducation;
  howToApply.value = data.howToApply;
  howToApplyLink.value = data.howToApplyLink;
};
const fetchJobData = () => {
  fetch("/job-details", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email: token.email, id: jobId }),
  })
    .then((res) => res.json())
    .then((data) => {
      //after getting the data send to front end to ppulate in forms
      console.log(data);
      setFormData(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

if (location.pathname !== "/post-job") {
  jobId = decodeURI(location.pathname.split("-").pop());
  fetchJobData();
  console.log("eee" + jobId);
} else {
  console.log("xxxx");
}
