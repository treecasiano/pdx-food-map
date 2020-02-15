const bcrypt = require("bcrypt");

function factory(logger, userService) {
  GET.apiDoc = {
    summary: "Get list of PDX Food Map User records",
    tags: ["User"],
    produces: ["application/json"],
    parameters: [],
    responses: {
      200: {
        description: "List of User records"
      },
      500: {
        description: "Server Error"
      }
    }
  };

  POST.apiDoc = {
    summary: "Create User record",
    tags: ["User"],
    produces: ["application/json"],
    parameters: [
      {
        description: "Record attributes",
        in: "body",
        name: "user",
        required: true,
        schema: {
          properties: {
            username: {
              description: "Username",
              type: "string"
            },
            password: {
              description: "Password",
              type: "string"
            }
          },
          required: ["username", "password"],
          type: "object"
        }
      }
    ],
    responses: {
      200: {
        description: "Successfully created a new user"
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
      result = await userService.list();
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Server Error" });
    }
    return res.status(200).json(result);
  }

  async function POST(req, res) {
    const { body: params } = req;
    let result;
    if (Object.keys(params).length < 2) {
      return res.status(400).json({ message: "Must include two attributes." });
    }
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      params.password = hashedPassword;
      result = await userService.create(params);
    } catch (e) {
      logger.error(e);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json(result);
  }
}

module.exports = factory;
