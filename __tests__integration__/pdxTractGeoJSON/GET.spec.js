const axios = require("axios");

test("Retrieves a geojson object (census tracts polygon features)", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:3000/api/pdxTractGeoJSON"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.features.length).toEqual(491);
    expect(results.data.type).toEqual("FeatureCollection");
    expect(results.data.features[0].type).toEqual("Feature");
    expect(results.data.features[0].geometry.coordinates).toBeInstanceOf(Array);
  } catch (e) {
    console.log(e);
    throw e;
  }
});
