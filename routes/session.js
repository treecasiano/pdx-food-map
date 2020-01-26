
function factory() {
    GET.apiDoc = {
      summary: "Retrieve user session data",
      tags: ["Session"],
      produces: ["application/json"],
      parameters: [],
      responses: {
        200: {
          description: "Status",
        },
        500: {
          description: "Server Error",
        },
      },
    };
  
    return {
      GET,
    };
  
    async function GET(req, res) {
      const { exp, loggedIn, user } = req.session;
  
      res.status(200).json({
        expires: exp,
        loggedIn,
        user
      });
    }
  }
  
  module.exports = factory;