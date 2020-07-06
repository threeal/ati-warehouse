const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:8081' }));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
db.mongoose
  .connect(db.url, {
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

app.get('/', (req, res) => {
  res.json({ message: 'test message' });
});

const tutorialRoute = require('./app/routes/tutorial.route.js');
tutorialRoute(app);

app.listen(8080, () => {
  console.log('server is running on port 8080');
});