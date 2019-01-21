import axios from 'axios';

// TODO : Remove hard-coded base URL

export default axios.create({
  baseURL: "http://localhost:3001/",
  responseType: 'json'
});