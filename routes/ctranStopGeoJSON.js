function factory(logger, ctranStopService) {
  GET.apiDoc = {
    summary: "Returns a GeoJSON Feature Collection (C-TRAN Transit Stops)",
    tags: ["C-TRAN"],
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
      result = await ctranStopService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
