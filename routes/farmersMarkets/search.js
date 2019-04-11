function factory(logger, farmersMarketService) {
  POST.apiDoc = {
    summary: "Search endpoint for Farmers Markets",
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
              description: "geometry",
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
