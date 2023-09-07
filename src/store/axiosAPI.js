import axios from "axios";
//Request Config設定， baseURL是API的主要Domain，之後發請求時只要填相對路徑就可以了
var instance = axios.create({
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
  },
  url: "/",
  method: "post",
  baseURL: 'https://localhost:44383/',
  timeout: 180000,
});

var instanceForm = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
    // Accept: "application/json",
  },
  url: "/",
  method: "post",
  baseURL: 'https://localhost:44383/',
  timeout: 180000,
});


export default {
  instance,
  instanceForm
};
