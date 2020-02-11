function factory(logger, groceryStoreService) {
  GET.apiDoc = {
    summary:
      "Returns a list of all Grocery Stores in the PDX-Vancouver-Hillsboro MSA",
    tags: ["PDX Metro Grocery Stores"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "List of records"
      },
      500: {
        description: "Server Error"
      }
    }
  };

  POST.apiDoc = {
    summary: "Creates a Grocery Store",
    tags: ["PDX Metro Grocery Stores"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Record attributes",
        in: "body",
        name: "groceryStore",
        required: true,
        schema: {
          properties: {
            name: {
              description: "Grocery Store Name",
              type: "string"
            },
            address: {
              description: "Grocery Store Location",
              type: "string"
            },
            bldg_sqft: {
              description: "Building Square Feet",
              type: "string"
            },
            status: {
              description: "Status",
              type: "string",
              enum: ["Existing", "Closed"]
            },
            type: {
              description: "Type of Store",
              type: "string",
              enum: ["Large Chain Grocery", "Independent or Ethnic Grocery"]
            },
            longitude: {
              description: "longitude",
              type: "number"
            },
            latitude: {
              description: "latitude",
              type: "number"
            }
          },
          required: ["name", "latitude", "longitude"],
          type: "object"
        }
      }
    ],
    responses: {
      200: {
        description: "Successfully created a new record"
      },
      400: {
        description: "Bad Request"
      },
      500: {
        description: "Internal Server Error"
      },
      default: {
        description: "An error occured"
      }
    }
  };

  return {
    GET,
    POST
  };

  async function GET(req, res) {
    let result;
    try {
      result = await groceryStoreService.list();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Server Error" });
    }
    return res.status(200).json(result);
  }

  async function POST(req, res) {
    const { body: params } = req;
    let result;
    if (Object.keys(params).length < 1) {
      return res
        .status(400)
        .json({ message: "Must include at least one attribute" });
    }
    try {
      const { gid } = await groceryStoreService.create(params);
      result = await groceryStoreService.get(gid);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ result });
  }
}

module.exports = factory;
