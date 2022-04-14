let loadImageFooter = function (variable) {
  var image = new Image();
  var url_image = "assets/img/logo-two.png";
  image.src = url_image;
  if (image.width == 0) {
    return `../assets/img/logo-two.png`;
  } else {
    return `assets/img/logo-two.png`;
  }
};

const footerContainer = document.querySelector(".footer-container");
const footer = () => {
  footerContainer.innerHTML += `
<div class="row">
<div class="col-sm-6 col-lg-3">
    <div class="footer-item">
        <div class="footer-logo">
            <a href="#">
                <img src="${loadImageFooter()}" alt="Logo">
            </a>
            <p>
            Jengite is a job site giving jobseekers free access to search for jobs.
            </p>
            <ul>
                
                <li>
                    <a href="#" target="_blank">
                        <i class="icofont-facebook"></i>
                    </a>
                </li>
                <li>
                    <a href="#" target="_blank">
                        <i class="icofont-instagram"></i>
                    </a>
                </li>
                <li>
                    <a href="#" target="_blank">
                        <i class="icofont-twitter"></i>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="col-sm-6 col-lg-3">
    <div class="footer-item">
        <div class="footer-category">
            <h3>Category</h3>
            <ul>
                <li>
                    <a href="#">
                        <i class="icofont-simple-right"></i>
                        Development
                    </a>
                </li>
               
                <li>
                    <a href="#">
                        <i class="icofont-simple-right"></i>
                        Tech & IT
                    </a>
                </li>
                
                <li>
                    <a href="#">
                        <i class="icofont-simple-right"></i>
                        Networking
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="col-sm-6 col-lg-3">
    <div class="footer-item">
        <div class="footer-category">
            <h3>Quick Links</h3>
            <ul>
                <li>
                    <a href="/">
                        <i class="icofont-simple-right"></i>
                        Home
                    </a>
                </li>
                <li>
                    <a href="/about">
                        <i class="icofont-simple-right"></i>
                        About Us
                    </a>
                </li>
            
                <!-- <li>
                    <a href="#">
                        <i class="icofont-simple-right"></i>
                        Testimonials
                    </a>
                </li> -->
            </ul>
        </div>
    </div>
</div>
<div class="col-sm-6 col-lg-3">
    <div class="footer-item">
        <div class="footer-find">
            <h3>Find Us</h3>
            <ul>
                <li>
                    <i class="icofont-location-pin"></i>
                    Mbezi,  Dar es Salaam
                </li>
                
                <li>
                    <i class="icofont-brand-whatsapp"></i>
                    <a href="tel:+255672203840">
                        +255 672 203 840
                    </a>
                </li>
                <li>
                    <i class="icofont-ui-email"></i>
                    <a href="mailto:jengite@gmail.com">
                        jengitetz@gmail.com
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
</div>
<div class="copyright-area">
<div class="row">
    <div class="col-lg-6">
        <div class="copyright-item">
            <p>Copyright @2022</p>
        </div>
    </div>
 
</div>
</div>`;
};

footer();

// subscribeBtn.addEventListener("click", () => {
//   console.log(email.value);
//   if (!email.value.length) {
//   } else {
//     await fetch("/contact", {
//       method: "post",
//       headers: new Headers({ "Content-Type": "application/json" }),
//       body: JSON.stringify({ email: email.value, subscribe: true }),
//     })
//       .then((res) => res.json())
//       .then((response) => {
//         processData(response);
//       });
//   }
// });
