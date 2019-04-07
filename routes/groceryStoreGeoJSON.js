function factory(logger, groceryStoreService) {
  GET.apiDoc = {
    summary: "Get a GeoJSON object (PDX Metro grocery stores)",
    tags: ["PDX Metro Grocery Stores"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "Point features in geojson format"
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
