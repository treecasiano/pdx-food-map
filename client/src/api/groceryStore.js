import axios from "axios";

export default {
  get(id) {
    return axios({
      method: "get",
      url: `/api/groceryStore/${id}`
    });
  },
  list() {
    return axios({
      method: "get",
      url: `/api/groceryStore`
    });
  },
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/groceryStoreGeoJSON`
    });
  }
};
