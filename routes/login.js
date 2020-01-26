const bcrypt = require("bcrypt");

function factory(auth, logger, userService) {
    POST.apiDoc = {
        summary: "Application Login",
        tags: ["User"],
        produces: ["application/json"],
        parameters: [
          {
            in: "formData",
            name: "username",
            required: true,
            type: "string",
          },
          {
            in: "formData",
            format: "password",
            name: "password",
            required: true,
            type: "string",
          },
        ],
        responses: {
          200: {
            description: "Successfully logged in",
          },
          400: {
            description: "Bad Request",
          },
          500: {
            description: "Internal Server Error",
          },
          default: {
            description: "An error occured",
          },
        },
      };
  
    return {
      POST
    };

    async function POST(req, res) {
      const {
        body: { password, username },
      } = req;

        let foundUser;
        let token;

        try {
          foundUser = await userService.get(username);

          if (foundUser.length === 0) {
            return res.status(401).json({message: "Unauthorized"});
          }

          const hashedPassword = await bcrypt.compare(password, foundUser[0].password);
          
          if (!hashedPassword) {
            return res.status(401).json({message: "Unauthorized"});
          }

          const user = {
            username: `${foundUser[0].username}`,
            isLoggedIn: true,
          };

          token = await auth.createJwt(user);
          token = { jwt: token.token };

        } catch (e) {
          logger.error(e);
          return res.status(500).json({ message: "Internal Server Error" });
        }
   
        return res
          .cookie("jwt", token.jwt)
          .status(200)
          .json({result: "Login successful!"});

      }
  }
  
  module.exports = factory;
  