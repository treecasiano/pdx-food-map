function factory(logger, pdxTractService) {
  GET.apiDoc = {
    summary: "Get a GeoJSON Feature Collection (PDX Metro census tracts)",
    tags: ["PDX Metro Census Tracts"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "Polygon features in geojson format"
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
      result = await pdxTractService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
