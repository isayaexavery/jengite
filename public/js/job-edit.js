// let jobId = null;

// const setFormData = (data) => {
//   jobTitle.value = data.title;
//   jobCategory.value = data.category;
//   companyName.value = data.company;
//   jobLocation.value = data.location;
//   jobDescr.value = data.description;
//   jobType = data.myJobType;
// };
// const fetchJobData = () => {
//   await fetch("/get-jobs", {
//     method: "post",
//     headers: new Headers({ "Content-Type": "application/json" }),
//     body: JSON.stringify({ email: token.email, id: jobId }),
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       //after getting the data send to front end to ppulate in forms
//       setFormData(data[0]);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// if (location.pathname != "/job-edit") {
//   jobId = decodeURI(location.pathname.split("/").pop());
//   // fetchJobData();
//   console.log("eee");
// } else {
//   console.log("xxxx");
// }
