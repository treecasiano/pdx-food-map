function factory(logger, bikePathPortlandService) {
  GET.apiDoc = {
    summary: "GeoJSON Feature Collection (City of Portland Bicycle Network)",
    tags: ["Bike Paths"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "Line Features"
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
      result = await bikePathPortlandService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
