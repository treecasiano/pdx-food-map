function factory(logger, farmersMarketService) {
  GET.apiDoc = {
    summary: "Get a GeoJSON Feature Collection (PDX Metro Farmers Markets)",
    tags: ["PDX Metro Farmers Markets"],
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
      result = await farmersMarketService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;