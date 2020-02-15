function factory(logger, groceryStoreService) {
  GET.apiDoc = {
    summary: "Get record by ID",
    tags: ["Grocery Stores"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Grocery Store ID",
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
    tags: ["Grocery Stores"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Grocery Store ID",
        in: "path",
        minimum: 1,
        name: "id",
        required: true,
        type: "integer"
      },
      {
        description: "updates",
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
    GET,
    PUT
  };

  async function GET(req, res) {
    const {
      params: { id }
    } = req;

    let record;

    try {
      record = await groceryStoreService.get(id);
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
    let oldLong;
    let oldLat;

    try {
      record = await groceryStoreService.get(id);
      if (!record) {
        return res
          .status(404)
          .json({ message: `Unable to find record for id: ${id}` });
      }
      oldLong = record.longitude;
      oldLat = record.latitude;

      // If only one long/lat value is being updated,
      // get the other value from the db because PostGIS functions
      // in the service need both values.
      if (updates.latitude && !updates.longitude) {
        updates.longitude = oldLong;
      }

      if (!updates.latitude && updates.longitude) {
        updates.latitude = oldLat;
      }
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Database error" });
    }

    let result;
    try {
      await groceryStoreService.update(id, updates);
      result = await groceryStoreService.get(id);
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
