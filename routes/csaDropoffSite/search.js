function factory(logger, csaDropoffSiteService) {
  POST.apiDoc = {
    summary:
      "Get list of CSA Dropoff Sites within a specified distance of a given point",
    tags: ["CSA Dropoff Sites"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Search terms",
        in: "body",
        name: "search",
        required: true,
        schema: {
          properties: {
            geom: {
              description: "longitude, latitude",
              type: "string"
            },
            distance: {
              description: "meters",
              type: "number"
            }
          },
          type: "object"
        }
      }
    ],
    responses: {
      200: {
        description: "OK"
      },
      500: {
        description: "Server Error"
      }
    }
  };

  return {
    POST
  };

  async function POST(req, res) {
    const { body } = req;

    let result;
    try {
      result = await csaDropoffSiteService.search(body);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!result) {
      result = [];
    }

    return res.status(200).json(result);
  }
}

module.exports = factory;
