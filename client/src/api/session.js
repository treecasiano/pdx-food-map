import axios from "axios";

export default {
  getSession() {
    return axios({
      method: "get",
      url: "/api/session",
    });
  },
  login({ password, username }) {
    return axios({
      data: {
        password,
        username,
      },
      method: "post",
      url: "/api/login",
    });
  },
};