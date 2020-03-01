const axios = require("axios");

test("Retrieves a GeoJSON feature collection (grocery store point features)", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:8080/api/groceryStoreGeoJSON"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.features.length).toEqual(265);
    expect(results.data.type).toEqual("FeatureCollection");
    expect(results.data.features[0].type).toEqual("Feature");
    const featureAttributes = ["geometry", "id", "properties", "type"];
    const propertyAttributes = [
      "address",
      "bldg_sqft",
      "latitude",
      "longitude",
      "name",
      "objectid",
      "state_id",
      "status",
      "type",
      "x",
      "y"
    ];

    const geojsonFeatureKeys = Object.keys(results.data.features[0]).sort();
    const geojsonPropertiesKeys = Object.keys(
      results.data.features[0].properties
    ).sort();

    expect(geojsonFeatureKeys.sort()).toEqual(featureAttributes);
    expect(geojsonPropertiesKeys).toEqual(propertyAttributes);
    expect(results.data.type).toEqual("FeatureCollection");
  } catch (e) {
    console.error(e);
    throw e;
  }
});
