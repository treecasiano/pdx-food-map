function factory(logger, groceryStoreService) {
  GET.apiDoc = {
    summary:
      "Returns a list of all grocery stores in the PDX-Vancouver-Hillsboro MSA",
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

  return {
    GET
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
}

module.exports = factory;
