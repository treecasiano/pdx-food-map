import axios from "axios";

export default {
  async create(data) {
    const response = await axios({
      data,
      method: "post",
      url: `/api/foodPantry`,
    });
    return response.data.result;
  },
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
  update(updates) {
    const url = `/api/foodPantry/${updates.gid}`;
    const data = Object.assign({}, updates);
    return axios({
      data,
      method: "put",
      url,
    });
  },
};
