function factory(logger, groceryStoreService) {
  GET.apiDoc = {
    summary:
      "GeoJSON Feature Collection (All Grocery Stores in the PDX-Vancouver-Hillsboro MSA)",
    tags: ["Grocery Stores"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "Point Features"
      },
      500: {
        description: "Server Error"
      }
    }
  };

  return {
    GET
  };

  async function GET(req, res) {
    let result;
    try {
      result = await groceryStoreService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
