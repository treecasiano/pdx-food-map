function factory(logger, farmersMarketService) {
  GET.apiDoc = {
    summary:
      "GeoJSON Feature Collection (All Farmers Markets in the PDX-Vancouver-Hillsboro MSA)",
    tags: ["Farmers Markets"],
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
      result = await farmersMarketService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
