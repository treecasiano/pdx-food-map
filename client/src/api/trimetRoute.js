import axios from "axios";

export default {
  getGeoJSON() {
    return axios({
      method: "get",
      url: `/api/trimetRouteGeoJSON`,
    });
  },
};
