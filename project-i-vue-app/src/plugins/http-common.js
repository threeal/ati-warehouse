import axios from 'axios'

export default axios.create({
  baseURL: `${location.protocol}//${location.hostname}:8080/api`,
  headers: {
    'Content-type': 'application/json'
  },
});