function factory(logger, farmersMarketService) {
  GET.apiDoc = {
    summary: "Get record by ID",
    tags: ["Farmers Markets"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Farmers Market ID",
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
    tags: ["Farmers Markets"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Farmers Market ID",
        in: "path",
        minimum: 1,
        name: "id",
        required: true,
        type: "integer"
      },
      {
        description: "updates",
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
              type: "string"
            },
            day: {
              description: "Farmers Market Day",
              type: "string"
            },
            open_dates: {
              description: "Open Dates",
              type: "string"
            },
            open_times: {
              description: "Open Time",
              type: "string"
            },
            accepts: {
              description: "Methods of Payment Accepted",
              type: "string"
            },
            status: {
              description: "Status",
              default: "Active",
              type: "string"
            },
            website: {
              description: "Farmers Market URL",
              type: "string"
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
      record = await farmersMarketService.get(id);
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
      record = await farmersMarketService.get(id);
      if (!record) {
        return res
          .status(404)
          .json({ message: `Unable to find record for id: ${id}` });
      }
      oldLong = record.longitude;
      oldLat = record.latitude;

      // If only one long/lat value is being updated, get the other value from the db because PostGIS functions in the service need both values.
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
      await farmersMarketService.update(id, updates);
      result = await farmersMarketService.get(id);
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
