const fullName = document.querySelector("#full-name");
const profession = document.querySelector("#profession");
const fileUpload = document.querySelector("#file-upload");
const doneBtn = document.querySelector(".create-ac-btn");

const logout = document.querySelector(".log-out");

const isPosted = document.querySelector(".is-posted");
// isPosted.style.display = "none";

const editName = document.querySelector("#edit-name");
const editProfession = document.querySelector("#edit-profession");
const alertMsg = document.querySelector(".alert-msg");

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

logout.addEventListener("click", () => {
  fetch("/logout", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data == "clear") {
        localStorage.removeItem("sakiti_token");
        location.reload();
      } else {
      }
    });

  // console.log("clickedd");
  // console.log(token);
  // // window.localStorage.removeItem("sakiti_token");
  // localStorage.removeItem("sakiti_token");
  // // location.reload();
  // location.replace("/");
});

fetch("/dashboard", {
  method: "post",
  headers: new Headers({ "Content-Type": "application/json" }),
  body: JSON.stringify({ email: token.email }),
})
  .then((res) => res.json())
  .then((response) => {
    fullName.textContent = response.data.name;
    if (response.data.profession) {
      profession.textContent = response.data.profession;
    } else {
      profession.textContent = "Edit your profession";
    }

    editName.value = response.data.name;

    let initial = response.data.name;
    document.getElementById("initial-img").innerHTML = initial.charAt(0);

    if (response.isPostedAnyJob == true) {
      // isPosted.style.display = "block";
    }
  });

// fileUpload.addEventListener("change", async function () {
//   const reader = new FileReader();
//   reader.addEventListener("load", (e) => {
//     const uploaded_image = reader.result;
//     document.querySelector(
//       "#display_image"
//     ).style.backgroundImage = `url(${uploaded_image})`;

//     console.log(typeof uploaded_image);
//   });
//   console.log(reader.readAsDataURL(this.files[0]));

//   const file = fileUpload.files[0];
//   // let formData = new FormData();
//   // formData.append("file", file);

//   // console.log(formData);

//   if (file.type.split("/")[0] === "image") {
//     fetch("/upload", {
//       method: "POST",
//       headers: new Headers({ "Content-Type": "multipart/form-data" }),
//       body: JSON.stringify(reader.result),
//     }).then((res) => {
//       imgUrl = url.split("?")[0];
//       // imagePath[0]
//       console.log(imgUrl);
//     });
//     // await fetch("/upload")
//     //   .then((res) => res.json())
//     //   .then((url) => {
//     //     console.log(url);
//     //     fetch(url, {
//     //       method: "PUT",
//     //       headers: new Headers({ "Content-Type": "multipart/form-data" }),
//     //       body: file,
//     //     }).then((res) => {
//     //       imgUrl = url.split("?")[0];
//     //       // imagePath[0]
//     //       console.log(imgUrl);
//     //     });
//     //   });
//   }
// });

doneBtn.addEventListener("click", async () => {
  doneBtn.classList.add("loading");
  alertMsg.classList.remove("show");
  if (!editName.value.length || !editProfession.value.length) {
    alertMsg.innerHTML = "Please enter Full Name and Profession...";
    alertMsg.classList.add("show");
    doneBtn.classList.remove("loading");
  } else {
    await fetch("/edit", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        fullName: editName.value,
        profession: editProfession.value,
        email: token.email,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response) {
          doneBtn.classList.remove("loading");
          location.replace("/dashboard");
        } else {
          doneBtn.classList.remove("loading");
        }
      });
  }
});

const currentPassword = document.querySelector("#old-password");
const password = document.querySelector("#password");
const password2 = document.querySelector("#password2");
const alertMsgPass = document.querySelector(".alert-msg-ii");
const successMsg = document.querySelector(".success-msg");

const changeBtn = document.querySelector(".change-pass-btn ");

const editPassword = async (newpassword) => {
  await fetch("/edit", {
    method: "post",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      newpassword: newpassword,
      email: token.email,
    }),
  })
    .then((res) => res.json())
    .then((response) => {
      if (response) {
        changeBtn.classList.remove("loading");
        console.log("changed...");
        successMsg.classList.add("show");
        // location.replace("/dashboard");
      } else {
        console.log("can not change");
        changeBtn.classList.remove("loading");
      }
    });
};
changeBtn.addEventListener("click", async () => {
  changeBtn.classList.add("loading");
  alertMsgPass.classList.remove("show");
  if (
    !currentPassword.value.length ||
    !password.value.length ||
    !password2.value.length
  ) {
    // console.log(
    //   "fill all" +
    //     currentPassword.value +
    //     " - " +
    //     password.value +
    //     " - " +
    //     password2
    // );
    alertMsgPass.innerHTML = "Please enter Fill all...";
    alertMsgPass.classList.add("show");
    changeBtn.classList.remove("loading");
  } else {
    changeBtn.classList.add("loading");
    await fetch("/login", {
      method: "post",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        email: token.email,
        password: currentPassword.value,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.name) {
          changeBtn.classList.remove("loading");
          console.log("checked is fine...");
          // location.replace("/dashboard");
          editPassword(password.value);
        } else if (response.alert) {
          showAlert(response.alert);
          console.log("can not change");
          changeBtn.classList.remove("loading");
        }
      });
  }
});

const showAlert = (msg) => {
  alertMsgPass.innerHTML = msg;
  alertMsgPass.classList.add("show");
};
