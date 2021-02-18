const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const models = require("../server/models");

const databaseUri =
  process.env.DATABASE_URI || "mongodb://localhost:27017/ati-warehouse";
models.mongoose
  .connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("Connected to the MongoDB!");

    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminFullname = process.env.ADMIN_FULLNAME || adminUsername;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin";

    models.User.findOne({ username: adminUsername })
      .then(user => {
        const bcrypt = require("bcryptjs");

        const newUserData = {
          username: adminUsername,
          fullname: adminFullname,
          password: bcrypt.hashSync(adminPassword, 8),
          verified: true,
          admin: true
        };

        if (user) {
          models.User.findByIdAndUpdate(user._id, newUserData, {
            useFindAndModify: false
          })
            .then(user => {
              console.log(`Admin ${user.username} updated!`);
            })
            .catch(() => {
              console.error("Failed to update admin!");
              process.exit();
            });
        } else {
          const newUser = new models.User(newUserData);
          newUser
            .save(newUser)
            .then(user => {
              console.log(`Admin ${user.username} created!`);
            })
            .catch(() => {
              console.log("Failed to create admin!");
              process.exit();
            });
        }
      })
      .catch(() => {
        console.log("Unexpected error");
        process.exit();
      });
  })
  .catch(err => {
    console.log("Cannot connect to the MongoDB!", err);
    process.exit();
  });

app.use((_, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const routes = require("../server/routes");
routes(app);

const serveStatic = require("serve-static");
const path = require("path");

app.use(serveStatic(path.resolve(__dirname, "../dist")));

app.get("*", function(_, response) {
  response.sendFile(path.resolve(__dirname, "../dist/index.html"));
});

const serveHttp = () => {
  console.log("No ssl private key provided for HTTPS!");

  const http = require("http");

  const httpPort = process.env.PORT || 80;
  http
    .createServer(app)
    .listen(httpPort)
    .on("error", () => {
      console.log(`Unable to create HTTP server on port ${httpPort}`);
      process.exit();
    });

  console.log(`HTTP server is running on port ${httpPort}!`);
};

const fs = require("fs");
fs.readFile(
  path.resolve(__dirname, "../ssl/ssl.key"),
  "utf8",
  (err, privateKey) => {
    if (err) {
      return serveHttp();
    }

    fs.readFile(
      path.resolve(__dirname, "../ssl/ssl.crt"),
      "utf8",
      (err, certificate) => {
        if (err) {
          return serveHttp();
        }

        let credentials = {
          key: privateKey,
          cert: certificate,
          requestCert: false,
          rejectUnauthorized: false
        };

        const https = require("https");

        const httpsPort = process.env.PORT || 443;
        https
          .createServer(credentials, app)
          .listen(httpsPort)
          .on("error", () => {
            console.log(`Unable to create HTTPS server on port ${httpsPort}`);
            process.exit();
          });

        console.log(`HTTPS server is running on port ${httpsPort}!`);

        if (process.env.REDIRECT_PORT) {
          const http = require("http");

          const httpPort = process.env.REDIRECT_PORT || 80;
          http
            .createServer((req, res) => {
              let hosts = req.headers.host.split(":");
              let host =
                hosts.length >= 2 ? `${hosts[0]}:${httpsPort}` : hosts[0];

              res.writeHead(301, { Location: `https://${host}${req.url}` });
              res.end();
            })
            .listen(httpPort)
            .on("error", () => {
              console.error(
                `Unable to create HTTP redirect server on port ${httpPort}`
              );
              process.exit();
            });

          console.log(`HTTP redirect server is running on port ${httpPort}!`);
        }
      }
    );
  }
);
