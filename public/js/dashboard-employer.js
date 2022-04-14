window.onload = () => {
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

    // if (token.recruiter === true) {
    //   setupJobs();
    // } else {
    //   location.replace("/become-a-recruiter");
    // }

    setupJobs();
  } else {
    location.replace("/login");
  }
};

let jobContainer = document.querySelector(".job-container");
let successMsg = document.querySelector(".success-container");
// successMsg.innerHTML = "";

const createJobs = (data) => {
  // let initial = data.name;
  // document.getElementById("company-logo").innerHTML = initial.charAt(0);

  //  <img src="${data.image || "assets/img/home-1/jobs/1.png"}" alt="Job">
  // above remove replaced with div #company logo
  jobContainer.innerHTML += `<div class="col-lg-6">
    <div class="job-item wow fadeInUp" data-wow-delay=".3s">
    <h3 class="company-logo" id="company-logo" >${data.company.charAt(0)}</h3>
        <div class="job-inner align-items-center">
            <div class="job-inner-left">
                <h3> ${data.title} </h3>
                <a >${data.company} </a>
                <ul>
                    <li>
                    <i class="icofont-web"></i>
                        ${data.companyWebsite || ""}
                    </li>
                    <li>
                        <i class="icofont-location-pin"></i>
                        ${data.companyLocation}
                    </li>
                </ul>
            </div>
            <div class="job-inner-right">
                <ul>
                    <li>
                    <a href="/job-details/${data.id}">View</a>
                    </li>
                    <li>
                     <a href="/post-job-${data.id}">Edit</a>
                    </li>
                    <li>
                    <a href="#" onClick="deleteItem('${data.id}')">Delete</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>`;
};

const setupJobs = () => {
  jobContainer.innerHTML = "<h4>Please Wait ....</h4>";
  fetch("/dashboard-employer", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email: token.email }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data == "no jobs") {
        console.log("show no jobs");
        jobContainer.innerHTML = `<h3>You do'nt have any post yet.</h3>`;
      } else {
        jobContainer.innerHTML = "";
        data.forEach((jobs) => createJobs(jobs));
      }
    });
};

const successFunction = () => {
  jobContainer.innerHTML = "";
  // setupJobs();
  setTimeout(function () {
    successMsg.innerHTML = `<div> 
        <div class="circle-border"></div>
        <div class="circle">
            <div class="success"></div>
          </div>
        </div> 
  </div> <h3>Successfull Deleted</h3>`;
  }, 3000);
  setupJobs();
  successMsg.innerHTML = "";
};

const deleteItem = async (id) => {
  console.log(id);
  var x = confirm("Are you sure you want to delete?");
  if (x) {
    // jobContainer.innerHTML =""
    successMsg.innerHTML = `<h3>Wait, Deleting ...</h3>`;
    fetch("/delete-job", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          successFunction();
        } else {
          successMsg.innerHTML =
            "<h3>Ooops! Something went wrong, can`t delete</h3>";
        }
      });
  }
};
