function factory(logger, farmersMarketService) {
  GET.apiDoc = {
    summary: "Get list of records",
    tags: ["Farmers Markets"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "List of Farmers Market records"
      },
      500: {
        description: "Internal Server Error"
      }
    }
  };

  POST.apiDoc = {
    summary: "Create a record",
    tags: ["Farmers Markets"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Record attributes",
        in: "body",
        name: "farmersMarket",
        required: true,
        schema: {
          properties: {
            market: {
              description: "Farmers Market Name",
              type: "string"
            },
            location: {
              description: "Farmers Market Location",
              type: ["string", "null"]
            },
            day: {
              description: "Farmers Market Day",
              type: ["string", "null"]
            },
            open_dates: {
              description: "Open Dates",
              type: ["string", "null"]
            },
            open_times: {
              description: "Open Time",
              type: ["string", "null"]
            },
            accepts: {
              description: "Methods of Payment Accepted",
              type: ["string", "null"]
            },
            status: {
              description: "Status",
              type: "string"
            },
            website: {
              description: "Farmers Market URL",
              type: ["string", "null"]
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
          required: ["market", "latitude", "longitude"],
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
      result = await farmersMarketService.list();
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
      const { gid } = await farmersMarketService.create(params);
      result = await farmersMarketService.get(gid);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ result });
  }
}

module.exports = factory;
