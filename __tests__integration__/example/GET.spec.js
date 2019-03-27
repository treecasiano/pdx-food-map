const axios = require("axios");

test("Retrieves a list of all records in hello_table", async () => {
  try {
    const results = await axios({
      method: "get",
      url: "http://localhost:3000/api/example"
    });
    expect(results.status).toEqual(200);
    expect(results.data).toBeInstanceOf(Array);
    expect(results.data.length).toEqual(7);
    expect(results.data[0].first_name).toEqual("Tereza");
  } catch (e) {
    console.log(e);
    throw e;
  }
});
