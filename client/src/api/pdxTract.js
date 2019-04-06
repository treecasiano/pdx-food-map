import axios from "axios";

export default {
  get(id) {
    return axios({
      method: "get",
      url: `/api/pdxTract/${id}`
    });
  },
  list() {
    return axios({
      method: "get",
      url: `/api/pdxTract`
    });
  },
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/pdxTractGeoJSON`
    });
  }
};
