const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const models = require('../server/models');
models.mongoose
  .connect(models.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to the MongoDB!');
  })
  .catch((err) => {
    console.log('Cannot connect to the MongoDB!', err);
    process.exit();
  });

app.use((_, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const routes = require('../server/routes');
routes(app);

const serveStatic = require('serve-static');
const path = require('path');

app.use(serveStatic(path.resolve(__dirname, '../dist')));

app.get('*', function (_, response) {
  response.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

let httpPort = process.argv[2] || 8080;
let httpsPort = process.argv[3] || 4433;

let http = require('http');
http.createServer(app).listen(httpPort);

console.log(`HTTP server is running on port ${httpPort}!`);

let fs = require('fs');
fs.readFile(path.resolve(__dirname, '../ssl/ssl.key'), 'utf8', (err, privateKey) => {
  if (!err) {
    fs.readFile(path.resolve(__dirname, '../ssl/ssl.crt'), 'utf8', (err, certificate) => {
      if (!err) {
        let credentials = {
          key: privateKey,
          cert: certificate,
          requestCert: false,
          rejectUnauthorized: false
        };

        let https = require('https');
        https.createServer(credentials, app).listen(httpsPort);

        console.log(`HTTPS server is running on port ${httpsPort}!`);
      }
      else {
        console.log('No ssl certificate provided for HTTPS!');
      }
    });
  }
  else {
    console.log('No ssl private key provided for HTTPS!');
  }
});