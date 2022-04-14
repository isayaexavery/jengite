const express = require("express");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
// const aws = require("aws-sdk");
const sendEmail = require("./sendMail");
const dotenv = require("dotenv");
const console = require("console");

dotenv.config();
let serviceAccount = require("./expenses-bf761-firebase-adminsdk-9w4ut-5327f0f47c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL,
});
const JWT_SECRET = process.env.JWT_SECRET;

let db = admin.firestore();

//FOR FUTURE USE ON AWS
// const region = "us-east-1";
// const bucketName = "sakiti-bucket";
// const accessKeyId = process.env.AWS_ACCESS_KEY;
// const secretAccessKey = process.env.AWS_SECRET_KEY;

// aws.config.update({
//   region,
//   accessKeyId,
//   secretAccessKey,
// });

// const s3 = new aws.S3();

// async function generatorUrl() {
//   let date = new Date();
//   let id = parseInt(Math.random() * 1000000000);
//   const imageName = `${id}${date.getTime()}.jpg`;
//   const params = {
//     Bucket: bucketName,
//     Key: imageName,
//     Expires: 300,
//     ContentType: "image/jpeg",
//   };
//   const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

//   return uploadUrl;
// }

let staticPath = path.join(__dirname, "public");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(staticPath));
app.use(express.json());

//variables
const toDaysDate = Date.now();
const daysForDelete = 86400000 * 14;

//home route
app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

//home route

app.post("/upload", async (req, res) => {
  const { path, filename } = req.body;
  console.log("pathh " + path + " name " + filename);

  const url = await uploadFile(path, filename);
  console.log(url);
  // res.json(await uploadFile(blob, name));
});
app.post("/", async (req, res) => {
  let { page, lastItem } = req.body;
  let size;
  let dbLastItem;
  if (!lastItem) {
    lastItem = 0;
  }

  await db
    .collection("jobs")
    .get()
    .then((snap) => {
      size = snap.size;
    });
  db.collection("jobs")
    .orderBy("id")
    .get()
    .then((jobs) => {
      if (jobs.empty) {
        return res.json("no jobs");
      }
      let jobsArr = [];

      jobs.forEach((item) => {
        let data = item.data();
        data.id = item.id;
        jobsArr.push(data);

        if (toDaysDate > data.timeStamp + daysForDelete) {
          deleteJob(data.id);
        }
      });

      res.json({ jobs: jobsArr, size: size });
    });
});

app.get("/jobs", (req, res) => {
  res.sendFile(path.join(staticPath, "job-list.html"));
});

//sigup route
app.get("/signup", (req, res) => {
  const authHeader = req.headers["authorization"];

  res.sendFile(path.join(staticPath, "signup.html"));
});

app.get("/login", (req, res) => {
  //     jwt.verify(req.token, JWT_SECRET, ( ) => {
  //       console.log(req.token);
  //        res.redirect('/');
  // });

  res.sendFile(path.join(staticPath, "login.html"));
});

app.post("/logout", (req, res) => {
  if (res.clearCookie("jwt")) {
    return res.json("clear");
  }
});

app.post("/signup", async (req, res) => {
  let { name, email, password, number, recruiter } = req.body;

  if (!name.length || !email.length || !number.length) {
    return res.json({ alert: "* Fill all " });
  } else if (name.length < 3) {
    return res.json({ alert: "* name  must be 3 letters long" });
  } else if (password.length < 8) {
    return res.json({ alert: "password must be 8 letters long" });
  }
  //store user in // DEBUG:
  db.collection("users")
    .doc(email)
    .get()
    .then((user) => {
      if (user.exists) {
        return res.json({
          alert: "email exists, consider retrieving your password",
        });
      } else {
        //encrypt password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            req.body.password = hash;
            db.collection("users")
              .doc(email)
              .set(req.body)
              .then((data) => {
                const token = jwt.sign({ email: req.body.email }, JWT_SECRET);
                res.json({
                  name: req.body.name,
                  email: req.body.email,
                  rectruiter: req.body.recruiter,
                  sakiti_token: token,
                });
              });
          });
        });
      }
    });
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(staticPath, "login.html"));
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  db.collection("users")
    .doc(email)
    .get()
    .then((user) => {
      if (user.exists) {
        bcrypt.compare(password, user.data().password, (err, result) => {
          if (result) {
            let data = user.data();

            const token = jwt.sign({ email: data.email }, JWT_SECRET);
            return res.json({
              name: data.name,
              email: data.email,
              recruiter: data.recruiter,
              sakiti_token: token,
            });
          } else {
            return res.json({ alert: "incorrect email/pasword" });
          }
        });
      } else {
        return res.json({ alert: "incorrect email/pasword" });
      }
    });
});

app.get("/forgotpassword", (req, res) => {
  res.sendFile(path.join(staticPath, "forgotpass.html"));
});

app.post("/forgotpassword", async (req, res) => {
  let { email } = req.body;
  if (!email.length) {
    return res.json({ alert: "* Fill email adress " });
  }
  db.collection("users")
    .doc(email)
    .get()
    .then((user) => {
      if (!user.exists) {
        return res.json({ alert: "email not exists" });
      } else {
        console.log("start here");
        //encrypt password
        const token = jwt.sign(
          { id: user.id },
          process.env.RESET_PASSWORD_KEY,
          { expiresIn: "30m" }
        );

        db.collection("users").doc(email).update({
          resetLink: token,
        });

        try {
          sendEmail(email, token);
          console.log("success sent");
          res.status(200).json({ success: true, email: email });
        } catch (err) {
          console.log(err);

          console.log("Not sent");
        }
      }
    });
});
app.get("/forgotpassword-:token", (req, res) => {
  res.sendFile(path.join(staticPath, "forgotpass.html"));
});
app.post("/forgotpassword-:token", (req, res) => {
  let { password, token, email } = req.body;

  console.log(token);
  if (password.length < 6) {
    return res.json({ alert: "Password must have more than 6 characters" });
  }

  let docRef = db.collection("users").doc(email);
  docRef.get().then((response) => {
    if (response.empty) {
      console.log("no token");
      return res.json(false);
    }
    // console.log(response.data().resetLink);
    console.log("token is " + response.data().resetLink + " token 2 " + token);

    if (response.resetLink) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          password = hash;
          console.log(hash);
          db.collection("users")
            .doc(email)
            .update({
              password: password,
              resetLink: "",
            })
            .then((data) => {
              res.json(true);
            });
        });
      });
    } else {
      return res.json(false);
    }
  });
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(staticPath, "dashboard.html"));
});

app.post("/dashboard", (req, res) => {
  const { email } = req.body;

  let isPostedAnyJob = false;

  docRef = db.collection("jobs").where("recruiterEmail", "==", email);

  docRef.get().then((jobs) => {
    if (!jobs.empty) {
      isPostedAnyJob = true;
    }
  });

  db.collection("users")
    .doc(email)
    .get()
    .then((data) => {
      res.json({ data: data.data(), isPostedAnyJob });
    });
});

app.get("/dashboard-employer", (req, res) => {
  res.sendFile(path.join(staticPath, "dashboard-employer.html"));
});

app.post("/dashboard-employer", (req, res) => {
  let { email, id } = req.body;
  let docRef = id
    ? db.collection("jobs").doc(id)
    : db.collection("jobs").where("recruiterEmail", "==", email);

  docRef.get().then((jobs) => {
    if (jobs.empty) {
      return res.json("no jobs");
    }
    let jobsArr = [];
    if (id) {
      return res.json(jobs.data());
    } else {
      jobs.forEach((item) => {
        let data = item.data();
        data.id = item.id;
        jobsArr.push(data);
      });

      res.json(jobsArr);
    }
  });
});
app.get("/dashboard-candidate", (req, res) => {
  res.sendFile(path.join(staticPath, "dashboard-candidate.html"));
});

app.post("/dashboard-candidate", (req, res) => {
  let { email, id } = req.body;
  let docRef = id
    ? db.collection("jobs").doc(id)
    : db.collection("jobs").where("recruiterEmail", "==", email);

  docRef.get().then((jobs) => {
    if (jobs.empty) {
      return res.json("no jobs");
    }
    let jobsArr = [];
    if (id) {
      return res.json(jobs.data());
    } else {
      jobs.forEach((item) => {
        let data = item.data();
        data.id = item.id;
        jobsArr.push(data);
      });

      res.json(jobsArr);
    }
  });
});

app.post("/edit", (req, res) => {
  let { fullName, profession, email, newpassword } = req.body;

  let docRef = db.collection("users").doc(email);

  if (newpassword) {
    console.log(newpassword);
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newpassword, salt, (err, hash) => {
        newpassword = hash;
        console.log(hash);
        db.collection("users")
          .doc(email)
          .update({
            password: newpassword,
          })
          .then((data) => {
            return res.json(true);
          });
      });
    });
  } else {
    docRef.get().then((response) => {
      if (response.empty) {
        console.log("no token");
        return res.json(false);
      }
      db.collection("users")
        .doc(email)
        .update({
          name: fullName,
          profession: profession,
        })
        .then((data) => {
          res.json(true);
        });
    });
  }
});
app.post("/job-list", (req, res) => {});

app.get("/become-a-recruiter", (req, res) => {
  res.sendFile(path.join(staticPath, "become-a-recruiter.html"));
});

app.get("/post-job", (req, res) => {
  res.sendFile(path.join(staticPath, "post-a-job.html"));
});
//for editing job
app.get("/post-job-:id", (req, res) => {
  res.sendFile(path.join(staticPath, "post-a-job.html"));
});

app.post("/post-job", (req, res) => {
  let {
    title,
    jobLocation,
    jobDescr,
    jobType,
    company,
    companyLocation,
    companyWebsite,
    recruiterEmail,
    applyLink,
    id,
    timeStamp,
  } = req.body;

  let docRef = id
    ? db.collection("jobs").doc(id).update(req.body)
    : db.collection("jobs").doc().set(req.body);

  if (
    !title.length ||
    !jobLocation.length ||
    !jobType.length ||
    !company.length ||
    !companyLocation.length
  ) {
    return res.json({ alert: "* Fill all the information" });
  } else {
    docRef.then((data) => {
      res.json(true);
    });
  }
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(staticPath, "post-success.html"));
});

//change password
app.post("/change-password", (req, res) => {
  const { token } = req.body;

  const user = jwt.verify(token, JWT_SECRET);
  console.log(user);
  res.json({ status: "ok" });
});

// app.get("/s3url", (req, res) => {
//   generatorUrl().then((url) => res.json(url));
// });

const deleteJob = (postId) => {
  db.collection("jobs")
    .doc(postId)
    .delete()
    .then((data) => {});
};
app.post("/delete-job", (req, res) => {
  let { postId } = req.body;

  db.collection("jobs")
    .doc(postId)
    .delete()
    .then((data) => {
      res.json(true);
    })
    .catch((err) => {
      res.json("err");
    });
});

//joob details route
app.get("/job-details/:id", (req, res) => {
  res.sendFile(path.join(staticPath, "job-details.html"));
});
app.post("/job-details", async (req, res) => {
  let { email, id } = req.body;
  let docRef = db.collection("jobs").doc(id).get();

  // console.log(await docRef);
  docRef.then((jobs) => {
    if (jobs.data() == null) {
      return res.json("no-jobs");
    }
    return res.json(jobs.data());
  });
});

app.get("/search?:key", (req, res) => {
  res.sendFile(path.join(staticPath, "search.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(staticPath, "about.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(staticPath, "contact.html"));
});
app.post("/contact", (req, res) => {
  const { fullname, email, phone, subject, description } = req.body;

  let docRef = db.collection("contact-us").doc(email).set(req.body);
  docRef.then((data) => {
    res.json(true);
  });
});

//404 route
app.get("/404", (req, res) => {
  res.sendFile(path.join(staticPath, "404.html"));
});

app.use((req, res) => {
  res.redirect("/404");
});

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}...`);
});
