const axios = require("axios");

test("Retrieves one record by id from hello_table", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:3000/api/example/1"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Object);
    expect(results.data.favorite_color).toEqual("teal");
    expect(results.data.first_name).toEqual("Tereza");
    expect(results.data.last_name).toEqual("Averescu");
    expect(results.data.geom).toEqual("POINT(-73.58 40.47)");
    expect(results.data.user_id).toEqual(1);
  } catch (e) {
    console.log(e);
    throw e;
  }
});

// {"favorite_color": "teal", "first_name": "Tereza", "geom": "POINT(-73.58 40.47)", "last_name": "Averescu", "user_id": 1}
