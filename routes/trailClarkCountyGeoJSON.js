function factory(logger, trailClarkCountyService) {
  GET.apiDoc = {
    summary: "Returns a GeoJSON Feature Collection",
    tags: ["Trails - Clark County"],
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
      result = await trailClarkCountyService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
