const url = new URL(window.location.href);
const searchKey = decodeURI(url.search.split("?").pop());
// let para = new URLSearchParams(location.search);
// let pass = para.get("search");

let resultsArray = [];

const searchQuery = document.querySelector("#search-title");
searchQuery.innerHTML = "Results for '" + searchKey + "'";
console.log(searchKey);

let jobsContainer = document.querySelector(".job-container");

const jobsCard = (data) => {
  jobsContainer.innerHTML += `<div class="col-lg-6">
  <div class="job-item">
      <img src="assets/img/home-1/jobs/1.png" alt="Job">
      <div class="job-inner align-items-center">
          <div class="job-inner-left">
              <h4>${data.title}</h4>
              <h3>${data.company}</h3>
              <ul>
                  <li>
                      <i class="icofont-user-alt-3"></i>
                      ${data.jobType}
                  </li>
                  <li>
                      <i class="icofont-location-pin"></i>
                      ${data.jobLocation}
                  </li>
              </ul>
          </div>
          <div class="job-inner-right">
              <ul>
                  <li>
                  <a href="/job-details/${data.id}">View</a>
                  </li>
                  <li>
                      <span>Full Time</span>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</div>`;
};

fetch("/", {
  method: "post",
  headers: new Headers({ "Content-Type": "application/json" }),
})
  .then((res) => res.json())
  .then((data) => {
    resultsArray = data.jobs;

    const resultsFound = resultsArray.filter(
      (elements) =>
        elements.title.toLowerCase() === searchKey.toLowerCase() ||
        elements.jobType.toLowerCase() === searchKey.toLowerCase()
    );
    if (resultsFound.length == 0) {
      searchQuery.innerHTML = "No Results for '" + searchKey + "'";
    }
    resultsFound.forEach((jobs) => jobsCard(jobs));
  });
