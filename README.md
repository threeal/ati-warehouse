# ATI Warehouse

Warehose management [PWA](https://en.wikipedia.org/wiki/Progressive_web_application) using MEVN stack.
Both client app and backend server are integrated as a single project instead of separated projects.
This project mainly written in [Node.js](https://nodejs.org/en/) and using some libraries or frameworks like [MongoDB](https://www.mongodb.com/) as the server database (with [mongoose](https://mongoosejs.com/) as the client library), [Express](https://expressjs.com/) as the HTTP/HTTPS framework, [Vue.js](https://vuejs.org/) as the client-side framework (with [Vuetify](https://vuetifyjs.com/en/) as the material design component framework).

We created this project as an internship project for [PT ATI (Aneka Tuna Indonesia)](http://tunaindonesia.com/), hence the project name is ATI Warehouse.
Previously, the warehouse management in PT ATI (especially the recording of incoming goods) is done using paper-based documents.
Some weakness of using paper-based documents are it's not durable and it will require more effort to do performance calculations.
That's why we provide a solution to replace the paper-based documents with a PWA based management application which integrated into a central database system.
Later the central database system could also be included with other calculation systems like the performance calculations that we mention earlier.

## Project Setup

- Install [Node.js](https://nodejs.org/en/) as in their [official guide](https://nodejs.org/en/download/).
  > As an alternative, you may install Node.js using the [NVM](https://github.com/nvm-sh/nvm).
- Install [MongoDB](https://www.mongodb.com/) as in their [official guide](https://docs.mongodb.com/manual/installation/).
- Install [Yarn](https://yarnpkg.com/) as in their [official guide](https://classic.yarnpkg.com/en/docs/install/).
  > If you don't want to use Yarn, you may skip this step and use [NPM](https://www.npmjs.com/) (the default of Node.js) instead.
- Open this project directory in terminal, and initialize the dependencies.
  ```bash
  $ yarn install
  ```
- create a `.env` file and fill it using the following options:
  - `PORT`, the port number used for the HTTP or HTTPS server.
  - `REDIRECT_PORT`, the port number used for the HTTP redirect server.
  - `DATABASE_URI`, the full URI of the MongoDB database (ex. `mongodb://user:pass@localhost:27017/db`).
  - `ADMIN_USERNAME`, the default admin's username.
  - `ADMIN_FULLNAME`, the default admin's fullname.
  - `ADMIN_PASSWORD`, the default admin's password.

## Usage

- Check code lint.
  ```bash
  $ yarn lint
  ```
- Compiles and minifes the client app for production.
  ```bash
  $ yarn build
  ```
  > As an alternative, you may hot reload the client app for debug purpose using `$ yarn serve`.
- Run the server using the following command:
  ```bash
  $ yarn start
  ```

## Using HTTPS

This project will automatically use HTTPS if there are both private key file (`ssl.key`) and certificate file (`ssl.crt`) inside the `ssl` folder.
Else, it will switched to use HTTP instead.
To generate a custom private key and certificate file, you may use the `sslgen.bash` script that has been provided in this project.
