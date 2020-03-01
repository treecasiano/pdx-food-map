const axios = require("axios");

test("Retrieves a geojson object (census tracts polygon features)", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:8080/api/pdxTractGeoJSON"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.features.length).toEqual(491);
    const featureAttributes = ["geometry", "properties", "type"];
    const propertyAttributes = [
      "censustrac",
      "county_1",
      "gid",
      "hunvflag",
      "lilatrac_1",
      "medianfami",
      "pop2010",
      "povertyrat",
      "state_1",
      "urban"
    ];

    const geojsonFeatureKeys = Object.keys(results.data.features[0]).sort();
    const geojsonPropertiesKeys = Object.keys(
      results.data.features[0].properties
    ).sort();

    expect(geojsonFeatureKeys.sort()).toEqual(featureAttributes);
    expect(geojsonPropertiesKeys).toEqual(propertyAttributes);

    expect(results.data.type).toEqual("FeatureCollection");
    expect(results.data.features[0].type).toEqual("Feature");
    expect(results.data.features[0].geometry.coordinates).toBeInstanceOf(Array);
  } catch (e) {
    console.error(e);
    throw e;
  }
});
