let loadImage = function (variable) {
  var image = new Image();
  var url_image = "assets/img/logo.png";
  image.src = url_image;
  if (image.width == 0) {
    return `../assets/img/logo.png`;
  } else {
    return `assets/img/logo.png`;
  }
};

const token = JSON.parse(localStorage.getItem("sakiti_token") || null);
let accountStatus = ` <a class="login-btn" href="/login">
<i class="icofont-plus-square"></i>
Login
</a>
<a class="sign-up-btn" href="/signup">
<i class="icofont-user-alt-4"></i>
Sign Up
</a>`;

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
    accountStatus = `
    <a class="sign-up-btn" href="/dashboard">
    Dashboard
    </a>`;
  }
} else {
}
// return JSON.parse(jsonPayload);

const navBar = () => {
  let navigation = document.querySelector(".nav");
  navigation.innerHTML += ` <nav class="navbar navbar-expand-lg navbar-light">
  <a class="navbar-brand" href="index.html">
      <img src="${loadImage()}" alt="Logo">
  </a>
  <div class="collapse navbar-collapse mean-menu" id="navbarSupportedContent">
      <ul class="navbar-nav">
          <li class="nav-item">
              <a href="/">Home </a>
          </li>
          
          <li class="nav-item">
            <a href="/jobs" class="nav-link">Jobs</a>
          </li>
         
        <li class="nav-item">
        <a href="/about" class="nav-link">About</a>
        </li>
          <li class="nav-item">
              <a href="/contact" class="nav-link">Contact</a>
          </li>
      </ul>

      <div class="common-btn">
         ${accountStatus}
      </div>
      </div>
</nav>`;
};

navBar();
