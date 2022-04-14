const dataContainer = document.querySelector("#job-container");
dataContainer.style.display = "none";
const loadingContainer = document.querySelector("#loading");

const setData = (data) => {
  let title = document.querySelector("title");
  let jobTitle = document.querySelector(".job-title");
  let jobDescr = document.querySelector(".descriptions");
  let requirements = document.querySelector(".reqList");
  let jobEduation = document.querySelector(".eduList");
  let howToApply = document.querySelector(".how-to-apply");
  let applyBtn = document.querySelector(".apply-btn");
  let company = document.querySelector(".company");
  let location = document.querySelector(".location");

  // title.innerHTML == data.job;
  jobTitle.innerHTML += data.title;
  document.querySelector("title").textContent = data.title;

  company.innerHTML += data.company;
  location.innerHTML += data.companyLocation;
  // requirements.innerHTML = data.jobRequirements;
  // jobEduation.innerHTML = data.jobEducation;
  howToApply.innerHTML = data.howToApply;

  if (data.howToApplyLink) {
    applyBtn.innerHTML = `<a class="job-details-btn" href="${data.howToApplyLink}"  target="_blank">Apply Now</a> `;
  }

  // console.log(data.jobDescr.split("\n"));
  data.jobDescr.split("\n").forEach((element) => {
    jobDescr.innerHTML += ` <p> ${element} </p>`;
  });
  data.jobRequirements.split("\n").forEach((element) => {
    requirements.innerHTML += ` <p> ${element} </p>`;
  });
  data.jobEducation.split("\n").forEach((element) => {
    jobEduation.innerHTML += ` <p> ${element} </p>`;
  });
};

const fetchJobDetails = () => {
  fetch("/job-details", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id: jobId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data == "no-jobs") {
        location.replace("/");
      } else {
        setData(data);
        dataContainer.style.display = "block";
        loadingContainer.style.display = "none";
      }
    })
    .catch((err) => {
      // location.replace("/404");
      console.log(err);
    });
};

let jobId = null;

if (location.pathname != "/job-details") {
  jobId = decodeURI(location.pathname.split("/").pop());
  console.log("id is " + jobId);
  fetchJobDetails();
}
