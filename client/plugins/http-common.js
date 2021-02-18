import axios from "axios";

export default axios.create({
  baseURL: `${location.protocol}//${location.hostname}:${location.port}/`,
  headers: {
    "Content-type": "application/json"
  }
});
