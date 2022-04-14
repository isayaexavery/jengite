const fullName = document.querySelector("#name");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone_number");
const subject = document.querySelector("#msg_subject");
const descr = document.querySelector("#message");

const submitBtn = document.querySelector(".create-ac-btn");
const contactWrap = document.querySelector(".contact-wrap");

let successMsg = document.querySelector(".success-container");
submitBtn.addEventListener("click", () => {
  if (
    !fullName.value ||
    !email.value ||
    !phone.value ||
    !subject.value ||
    !descr.value
  ) {
  } else {
    submitForm({
      fullname: fullName.value,
      email: email.value,
      phone: phone.value,
      subject: subject.value,
      description: descr.value,
    });
  }
});

const successFunction = () => {
  // setupJobs();
  contactWrap.innerHTML = "";
  successMsg.innerHTML = `
    <div> 
        <div class="circle-border"></div>
                <div class="circle">
                    <div class="success"></div>
                </div>    
    </div> 
    <h3>Successfull Sent</h3> 
    `;
  submitBtn.classList.remove("loading");
};

const submitForm = async (data) => {
  submitBtn.classList.add("loading");
  await fetch("/contact", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      if (response) {
        successFunction();
      }
    });
};
