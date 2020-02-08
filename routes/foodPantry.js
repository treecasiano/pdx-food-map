function factory(logger, foodPantryService) {
  GET.apiDoc = {
    summary: "Gets a list of all Food Pantries",
    tags: ["PDX Metro Food Pantries"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "List of records"
      },
      500: {
        description: "Internal Server Error"
      }
    }
  };

  POST.apiDoc = {
    summary: "Creates a Food Pantry",
    tags: ["PDX Metro Food Pantries"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Record attributes",
        in: "body",
        name: "foodPantry",
        required: true,
        schema: {
          properties: {
            location_name: {
              description: "Food Pantry Name",
              type: "string"
            },
            street_address_1: {
              description: "Street Address Line 1",
              type: "string"
            },
            street_address_2: {
              description: "Street Address Line 2",
              type: "string"
            },
            city: {
              description: "City",
              type: "string"
            },
            state: {
              description: "State",
              type: "string"
            },
            zip: {
              description: "ZIP Code",
              type: "string"
            },
            hours_of_operation: {
              description: "Hours of Operation",
              type: "string"
            },
            website: {
              description: "Food Pantry URL",
              type: "string"
            },
            phone: {
              description: "Food Pantry Phone Number",
              type: "string"
            },
            geom: {
              description: "Geometry in the form of 'POINT(long lat)'",
              type: "string"
            }
          },
          required: ["location_name", "geom"],
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
    // TODO: Handle case where id not found.
    let result;
    try {
      result = await foodPantryService.list();
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
      const { gid } = await foodPantryService.create(params);
      result = await foodPantryService.get(gid);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ result });
  }
}

module.exports = factory;
