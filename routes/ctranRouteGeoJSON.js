function factory(logger, ctranRouteService) {
  GET.apiDoc = {
    summary: "GeoJSON Feature Collection (C-TRAN Transit Route)",
    tags: ["C-TRAN"],
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
      result = await ctranRouteService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
