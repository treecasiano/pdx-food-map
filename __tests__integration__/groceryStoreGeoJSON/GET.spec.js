const axios = require("axios");

test("Retrieves a GeoJSON feature collection (grocery store point features)", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:3000/api/groceryStoreGeoJSON"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.features.length).toEqual(105);
    expect(results.data.type).toEqual("FeatureCollection");
    expect(results.data.features[0].type).toEqual("Feature");
    expect(results.data.features[0]).toEqual({
      geometry: {
        coordinates: [-122.697560163699, 45.5773330459487],
        type: "Point"
      },
      id: 1,
      properties: {
        address: "3011 N LOMBARD ST",
        bldg_sqft: 5823,
        name: "Green Zebra Grocery",
        objectid: 101,
        state_id: "1N1E09CC  5600",
        status: "Existing",
        type: "Independent or Ethnic Grocery",
        x: 7639467.013063886,
        y: 704231.9593578038
      },
      type: "Feature"
    });
    expect(results.data.type).toEqual("FeatureCollection");
  } catch (e) {
    console.log(e);
    throw e;
  }
});
