import axios from "axios";

axios.defaults.baseURL = "http://localhost:5260/";
axios.defaults.withCredentials = true;

const responseBody = (response) => response.data;

const requests = {
  get: (url, params) => axios.get(url, { params }).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  delete: (url) => axios.delete(url).then(responseBody),
};

const User = {
  login: (values) => requests.post(`user/login`, values),
  getUsers: () => requests.get("user/users"),
  register: (values) => requests.post("user/register", values),
  currentUser: (params) => requests.get(`user/currentUser?userId=${params}`),
};

const PersonalFinance = {
  deleteOrder: (id) => requests.delete(`personalFinance/${id}`),
  getOrders: (id) => requests.get(`personalFinance/${id}`),
  upsertOrder: (values) => requests.post(`personalFinance`, values),
};

const agent = {
  User,
  PersonalFinance,
};

export default agent;
