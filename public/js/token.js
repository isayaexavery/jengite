let char = `123abcde.fmnopqlABCDE@FJKLMNOPQRSTUVWXYZ456789stuvwxyz0!#$%&ijkrgh'*+-/=?^_${"`"}{|}~`;

const generateToken = (key) => {
  let token = "";
  for (let i = 0; i < key.length; i = i++) {
    let index = char.indexOf(key[i]) || char.length / 2;
    let randomIndex = Math.floor(Math.random() * index);
    token += char[randomIndex] + char[index - randomIndex];
  }
  console.log(token, key);
  return token;
};

// const compareToken = (token, key) => {
//   let string = "";
//   for (let i = 0; i < token.length; i = i + 2) {
//     let index1 = char.indexOf(token[i]);
//     let index2 = char.indexOf(token[i + 1]);
//     string += char[index1 + index2];
//   }

//   if (string === key) {
//     return true;
//   }

//   return false;
// };

// const sendData = async (path, data) => {
//   await fetch(path, {
//     method: "post",
//     headers: new Headers({ "Content-Type": "application/json" }),
//     body: JSON.stringify(data),
//   })
//     .then((res) => res.json())
//     .then((response) => {
//       processData(response)
//     });
// };
//
// const processData = (data) => {
//   loader.style.display = null;
//   if (data.alert) {
//     showAlert(data.alert);
//   } else if (data.name) {
//     //create token
//     // console.log(data.email);
//      // data.authToken = generateToken(data.email);
//     // sessionStorage.user = JSON.stringify(data);
//     // const token = jwt.sign(data, JWT_SECRET );
//     // console.log(data);
//
//     localStorage.setItem('sakiti_token', JSON.stringify(data));
//     location.replace("/");
//   }
// };
//
// const showAlert = (msg) => {
//   alertMsg.innerHTML = msg;
//
//   alertMsg.classList.add("show");
// };

const compareToken = (token) => {
  if (token) {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  return null;
};
