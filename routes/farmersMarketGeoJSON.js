function factory(logger, farmersMarketService) {
  GET.apiDoc = {
    summary:
      "Returns a GeoJSON Feature Collection (All Farmers Markets in the PDX-Vancouver-Hillsboro MSA)",
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
    console.log("farmers market route logs?");
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
