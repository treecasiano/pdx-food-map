const axios = require("axios");

test("Retrieves a GeoJSON feature collection (farmers market point features)", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:3000/api/farmersMarketGeoJSON"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.features.length).toEqual(17);
    expect(results.data.type).toEqual("FeatureCollection");
    expect(results.data.features[0].type).toEqual("Feature");
    expect(results.data.features[0]).toEqual({
      geometry: {
        coordinates: [-122.693616132003, 45.478066364976],
        type: "Point"
      },
      id: 1,
      properties: {
        accepts: "cash, credit, debit, SNAP (up to $10 match) and FDNP",
        day: "Sunday",
        location: "SW Capitol Highway and SW Sunset Boulevard",
        market: "Hillsdale Farmers Market",
        objectid: 1,
        open_dates:
          "March 3, 17 & 31, April  14; weekly April 28 - November 24; December 8 and 22",
        open_times: "9 a.m. - 1 p.m",
        status: "Active",
        website: "http://www.hillsdalefarmersmarket.com",
        xcoord: 7639493.924769827,
        ycoord: 668024.4915639336
      },
      type: "Feature"
    });
    expect(results.data.type).toEqual("FeatureCollection");
  } catch (e) {
    console.log(e);
    throw e;
  }
});
