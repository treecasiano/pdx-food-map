function factory(logger, csaDropoffSiteService) {
  GET.apiDoc = {
    summary:
      "Returns a GeoJSON Feature Collection (CSA Dropoff Sites in PDX-Vancouver-Hillsboro MSA)",
    tags: ["PDX Metro CSA Dropoff Sites"],
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
      result = await csaDropoffSiteService.getGeoJSON();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
