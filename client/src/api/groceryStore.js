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
  },
  getGeoDataByType(params) {
    return axios({
      data: params,
      method: "post",
      url: `/api/groceryStore/getGeoDataByType`
    });
  },
  search(params) {
    return axios({
      data: params,
      method: "post",
      url: `/api/groceryStore/search`
    });
  }
};
