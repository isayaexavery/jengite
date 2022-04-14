let postId;
let pageNum = location.search.split("=").pop();
// let startAt = 0;
// let endAt;
// let numberOfresults = 3;

let resultsArray = [];

let availableJobsTitle = document.querySelector(".section-title");
availableJobsTitle.innerHTML = "<h2>Loading Available Jobs ...</h2>";

let jobsContainer = document.querySelector(".job-container");

const jobsCard = (data) => {
  availableJobsTitle.innerHTML = "<h2>Available Jobs</h2>";

  let initial = data.company;
  // document.getElementById("company-logo").innerHTML = initial.charAt(0);
  //  <img src="${data.image || "assets/img/home-1/jobs/1.png"}" alt="Job">
  // above remove replaced with div #company logo
  jobsContainer.innerHTML += `<div class="col-lg-6">
  <div class="job-item">
      <h3 class="company-logo" id="company-logo" >${data.company.charAt(0)}</h3>
      <div class="job-inner align-items-center">
          <div class="job-inner-left">
              <h3>${data.title}</h3>
              <h4>${data.company}</h4>
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
                      <span> ${data.jobType}</span>
                  </li>
              </ul>
          </div>
      </div>
  </div>
</div>`;

  // document.getElementById("initial").innerHTML = initial.charAt(0);
};

fetch("/", {
  method: "post",
  headers: new Headers({ "Content-Type": "application/json" }),
  body: JSON.stringify({
    page: pageNum,
    lastItem: postId,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data == "no jobs") {
      availableJobsTitle.innerHTML =
        "<h2>No Available Jobs, try again later...</h2>";
    } else {
      resultsArray = data.jobs;
      const numberOfItems = data.size;
      const numberOfItemsPerPage = 6;
      let currentPage = 1;
      const numberOfPages = Math.ceil(numberOfItems / numberOfItemsPerPage);
      if (pageNum) {
        currentPage = pageNum;
      }

      const trimStart = (currentPage - 1) * numberOfItemsPerPage;
      const trimEnd = trimStart + numberOfItemsPerPage;

      data.jobs.slice(trimStart, trimEnd).forEach((jobs) => {
        jobsCard(jobs);
        console.log("delete +" + jobs.timeStamp + "  - " + jobs.id);
        console.log(jobs.timeStamp + 86400000 * 14);
      });
      jobPagination(data.size);
    }
  });

const jobPagination = (size) => {
  let paginationContainer = document.querySelector(".job-list-pagination");

  size = Math.ceil(size / 6);
  paginator({
    target: paginationContainer,
    total: size,
    click: "/",
    // append query string if you want
    // click : "1-anchor.html?search=foo&sort=asc"
  });
};

function paginator(instance) {
  //  target  : html element to generate pagination.
  //  total   : total number of pages.
  //  click   : url string or function to call on click.
  //  current : (optional) current page, default 1.
  //  adj     : (optional) num of adjacent pages beside "current page", default 2.

  // (A) INIT & SET DEFAULTS
  if (instance.current === undefined) {
    let param = new URLSearchParams(window.location.search);
    instance.current = param.has("pg") ? Number.parseInt(param.get("pg")) : 1;
  }
  if (instance.adj === undefined) {
    instance.adj = 2;
  }
  if (instance.adj <= 0) {
    instance.adj = 1;
  }
  if (instance.current <= 0) {
    instance.current = 1;
  }
  if (instance.current > instance.total) {
    instance.current = instance.total;
  }

  // (B) URL STRING ONLY - DEAL WITH QUERY STRING & APPEND PG=N
  const jsmode = typeof instance.click == "function";
  if (jsmode == false) {
    if (instance.click.indexOf("?") == -1) {
      instance.click += "?pg=";
    } else {
      instance.click += "&pg=";
    }
  }

  // (C) HTML PAGINATION WRAPPER
  instance.target.innerHTML = "";
  instance.target.classList.add("paginate");

  // (D) DRAW PAGINATION SQUARES
  // (D1) HELPER FUNCTION TO DRAW PAGINATION SQUARE
  const square = (txt, pg, css) => {
    const node = document.createElement("li");

    let el = document.createElement("a");
    node.appendChild(el);

    el.innerHTML = txt;
    if (css) {
      el.className = css;
    }
    if (jsmode) {
      el.onclick = () => {
        instance.click(pg);
      };
    } else {
      el.href = instance.click + pg;
    }
    instance.target.appendChild(node);
  };

  // (D2) BACK TO FIRST PAGE (DRAW ONLY IF SUFFICIENT SQUARES)
  if (instance.current - instance.adj > 1) {
    square(`<i class="icofont-simple-left"></i>`, 1, "first");
  }

  // (D3) ADJACENT SQUARES BEFORE CURRENT PAGE
  let temp;
  if (instance.current > 1) {
    temp = instance.current - instance.adj;
    if (temp <= 0) {
      temp = 1;
    }
    for (let i = temp; i < instance.current; i++) {
      square(i, i);
    }
  }

  // (D4) CURRENT PAGE
  square(instance.current, instance.current, "current");

  // (D5) ADJACENT SQUARES AFTER CURRENT PAGE
  if (instance.current < instance.total) {
    temp = instance.current + instance.adj;
    if (temp > instance.total) {
      temp = instance.total;
    }
    for (let i = instance.current + 1; i <= temp; i++) {
      square(i, i);
    }
  }

  // (D6) SKIP TO LAST PAGE (DRAW ONLY IF SUFFICIENT SQUARES)
  if (instance.current <= instance.total - instance.adj - 1) {
    square(`<i class="icofont-simple-right"></i>`, instance.total, "last");
  }
}

const searchBtn = document.querySelector(".banner-form-btn");
const searchBox = document.querySelector(".search-box");

const searchChange = () => {
  // const searchBoxId = document.getElementById("#search-box").value;
  if (!searchBox.value.length) {
    resultsArray.forEach((jobs) => jobsCard(jobs));
  } else {
    console.log("typed : " + searchBox.value);
  }
};

searchBtn.addEventListener("click", () => {
  console.log("typed : " + searchBox.value);

  if (searchBox.value.length) {
    window.location.href = "search?" + searchBox.value;
    // const resultsFound = resultsArray.filter(
    //   (elements) =>
    //     elements.title.toLowerCase() === searchBox.value.toLowerCase()
    // );

    // resultsFound.forEach((jobs) => jobsCard(jobs));

    // console.log(resultsArray);
    // console.log(resultsFound);
  }
});
