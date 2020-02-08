function factory(logger, foodPantryService) {
  DELETE.apiDoc = {
    summary: "Deletes a record by ID",
    tags: ["PDX Metro Food Pantries"],
    parameters: [
      {
        description: "Food Pantry Record ID",
        in: "path",
        minimum: 1,
        name: "id",
        required: true,
        type: "integer"
      }
    ],
    responses: {
      200: {
        description: "OK"
      },
      404: {
        description: "Not found"
      },
      500: {
        description: "Server Error"
      }
    }
  };

  GET.apiDoc = {
    summary: "Get Food Pantry record by ID",
    tags: ["PDX Metro Food Pantries"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Food Pantry ID",
        in: "path",
        minimum: 1,
        name: "id",
        required: true,
        type: "integer"
      }
    ],
    responses: {
      200: {
        description: "OK"
      },
      404: {
        description: "Not found"
      },
      500: {
        description: "Server Error"
      }
    }
  };

  PUT.apiDoc = {
    summary: "Update record",
    tags: ["PDX Metro Food Pantries"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Food Pantry ID",
        in: "path",
        minimum: 1,
        name: "id",
        required: true,
        type: "integer"
      },
      {
        description: "updates",
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
          type: "object"
        }
      }
    ],
    responses: {
      200: {
        description: "OK"
      },
      404: {
        description: "Not found"
      },
      500: {
        description: "Server Error"
      }
    }
  };

  return {
    DELETE,
    GET,
    PUT
  };

  async function DELETE(req, res) {
    const {
      params: { id }
    } = req;

    let record;
    let result;
    try {
      record = await foodPantryService.get(id);
      if (!record) {
        return res.status(404).json({ message: `No record for id: ${id}` });
      }
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    try {
      result = await foodPantryService.remove(id);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ result });
  }

  async function GET(req, res) {
    const {
      params: { id }
    } = req;

    let record;
    try {
      record = await foodPantryService.get(id);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Server Error" });
    }
    if (!record) {
      return res.status(404).json({ message: `No record for id ${id}` });
    }
    return res.status(200).json(record);
  }

  async function PUT(req, res) {
    const {
      params: { id }
    } = req;

    const updates = req.body;

    if (Object.keys(updates).length < 1) {
      return res
        .status(400)
        .json({ message: "Must update at least one attribute" });
    }

    let record;
    try {
      record = await foodPantryService.get(id);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }

    if (!record) {
      return res
        .status(404)
        .json({ message: `Unable to find record for id: ${id}` });
    }

    let result;
    try {
      await foodPantryService.update(id, updates);
      result = await foodPantryService.get(id);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({
        message: "Database error"
      });
    }

    return res.status(200).json({ result });
  }
}

module.exports = factory;
