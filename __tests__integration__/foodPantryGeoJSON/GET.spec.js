const axios = require("axios");

test("Retrieves a GeoJSON feature collection (food pantry point features)", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:3000/api/foodPantryGeoJSON"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.features.length).toEqual(2);
    expect(results.data.type).toEqual("FeatureCollection");
    expect(results.data.features[0].type).toEqual("Feature");

    const featureAttributes = ["geometry", "id", "properties", "type"];
    const propertyAttributes = [
      "areas_served",
      "city",
      "date_created",
      "hours_of_operation",
      "latitude",
      "location_name",
      "longitude",
      "phone",
      "state",
      "street_address_1",
      "street_address_2",
      "website",
      "zip"
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
