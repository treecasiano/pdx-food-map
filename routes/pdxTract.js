function factory(logger, pdxTractService) {
  GET.apiDoc = {
    summary:
      "Get a list of all census tracts in the PDX-Vancouver-Hillsboro MSA",
    tags: ["PDX Metro Census Tracts"],
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
      result = await pdxTractService.list();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Server Error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
