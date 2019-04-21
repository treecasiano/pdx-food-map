function factory(logger, groceryStoreService) {
  POST.apiDoc = {
    summary:
      "Returns a GeoJSON Feature Collection (Grocery Stores in the PDX-Vancouver-Hillsboro MSA by store type)",
    tags: ["PDX Metro Grocery Stores"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Search terms",
        in: "body",
        name: "search",
        required: true,
        schema: {
          properties: {
            type: {
              description: "Type of grocery store",
              type: "string"
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
    console.log("POST BODY", body);

    let result;
    try {
      result = await groceryStoreService.getGeoDataByType(body);
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
