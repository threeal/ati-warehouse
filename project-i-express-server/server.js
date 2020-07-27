const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const models = require('./app/models');
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

app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

const routes = require('./app/routes');
routes(app);

app.listen(8080, () => {
  console.log('server is running on port 8080');
});