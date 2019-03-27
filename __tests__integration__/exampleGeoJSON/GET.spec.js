const axios = require("axios");

test("Retrieves a geojson object from the hello_table", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:3000/api/exampleGeoJSON"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.result.features.length).toEqual(7);
    expect(results.data.result.features[0].properties.first_name).toEqual(
      "Tereza"
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
});
