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
    console.log('connected to the databse!');
  })
  .catch((err) => {
    console.log('cannot connect to the databse!', err);
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
  response.sendFile(path.resolve(__dirname, '../dist/app.html'));
});

app.listen(8081, () => {
  console.log('server is running on port 8080');
});