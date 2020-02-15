function factory(logger, pdxTractService) {
  GET.apiDoc = {
    summary:
      "GeoJSON Feature Collection (All Census Tracts in the PDX-Vancouver-Hillsboro MSA)",
    tags: ["Census Tracts"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "Polygon Features"
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
