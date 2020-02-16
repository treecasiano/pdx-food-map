import axios from "axios";

export default {
  get(id) {
    return axios({
      method: "get",
      url: `/api/foodPantry/${id}`,
    });
  },
  list() {
    return axios({
      method: "get",
      url: `/api/foodPantry`,
    });
  },
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/foodPantryGeoJSON`,
    });
  },
  search(params) {
    return axios({
      data: params,
      method: "post",
      url: `/api/foodPantry/search`,
    });
  },
};
