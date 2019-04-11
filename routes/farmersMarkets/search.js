function factory(logger, farmersMarketService) {
  POST.apiDoc = {
    summary:
      "Returns a list of Farmers Markets within a specified distance of a given point",
    tags: ["PDX Metro Farmers Markets"],
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
              description: "kilometers",
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
      result = await farmersMarketService.search(body);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!result) {
      result = [];
    }

    return res.status(200).json({ result });
  }
}

module.exports = factory;
