const bodyParser = require("body-parser");
const config = require("config");
const cookieParser = require("cookie-parser");
const express = require("express");
const expressOpenapi = require("express-openapi");
const path = require("path");
const pkg = require("./package");

const Auth = require("./lib/Auth");

const FarmersMarketService = require("./lib/farmersMarketService");
const GroceryStoreService = require("./lib/groceryStoreService");
const PdxTractService = require("./lib/pdxTractService");
const UserService = require("./lib/UserService");
const pgFactory = require("./lib/pg");

const env = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

// Set timezone for app in case its different than system timezone.
process.env.TZ = "UTC";

(async function init() {
  const logger = console;

  try {
    const pg = pgFactory({
      config: config.get("pg")
    });

    const jwtConfig = config.get("jwt");

    const auth = new Auth(jwtConfig);

    const farmersMarketService = new FarmersMarketService({ pg });
    const groceryStoreService = new GroceryStoreService({ pg });
    const pdxTractService = new PdxTractService({ pg });
    const userService = new UserService({ pg });

    const app = express();

    app.use("/files", express.static("files"));
    app.use("/js", express.static("public/js"));

// Authorization
function authorizeRoute(req, res, next) {
  const {
    cookies: { jwt },
    path,
  } = req;

  console.log("jwt from authoizeRoute", jwt)

  // All API routes are whitelisted for now. PUT and POST routes will check for permissions.
  const whiteList = [
    /^\/login/,
    /^\/docs/,
    /^\/pdxTract/,
    /^\/farmersMarket/,
    /^\/groceryStore/,
  ];

  auth
    .authorizeRoute(path, jwt, whiteList)
    .then(results => {
      if (!results.token) {
        next();
        return;
      }
      console.log("results", results);
      req.session = results.payload;
      console.log("req.session", req.session)
      res.cookie("jwt", results.token);
      next();
    })
    .catch(e => {
      res.status(401).send(e);
    });
}

    app.use(
      bodyParser.json({
        limit: "50mb"
      })
    );

    app.use(
      bodyParser.urlencoded({
        extended: false
      })
    );
    app.use(cookieParser());

    app.options("/*", (req, res) => {
      res.header("Access-Control-Allow-Methods", "GET,POST OPTIONS");
      return res.status(200).send();
    });

    app.use(express.static(path.join(__dirname, "client/dist")));

    // api docs
    app.get("/swagger-ui", (req, res, next) => {
      // add url to querystring if it isn't there
      if (!req.query.url) {
        res.redirect("/swagger-ui?url=/api/docs");
        return;
      }
      next();
    });

    app.use("/swagger-ui", express.static("swagger-ui-3.18.3/dist"));

    // Middleware for disabling caching on api routes
    app.use("/api", (req, res, next) => {
      res.set({
        "Cache-Control": "no-store, must-revalidate",
        Expires: "0"
      });
      next();
    });

    // Check JWT on api routes
    app.use("/api", authorizeRoute);

    expressOpenapi.initialize({
      app,
      apiDoc: {
        basePath: "/api",
        definitions: {},
        info: {
          title: pkg.name,
          version: pkg.version
        },
        paths: {},
        swagger: "2.0",
        "x-express-openapi-schema-extension": {
          definitions: {
            schema: {
              properties: {
                anyOf: {
                  type: "array",
                  items: {
                    $ref: "#/definitions/schema"
                  }
                },
                oneOf: {
                  type: "array",
                  minItems: 1,
                  items: {
                    $ref: "#/definitions/schema"
                  }
                }
              }
            }
          }
        }
      },
      dependencies: {
        auth,
        env,
        farmersMarketService,
        groceryStoreService,
        pdxTractService,
        userService,
        logger
      },
      paths: "./routes",
      exposeApiDocs: true,
      docsPath: "/docs",
      // eslint-disable-next-line
      errorMiddleware(err, req, res, next) {
        logger.error(err);
        return res.status(400).json(err);
      }
    });

    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "client/dist/index.html"));
    });

    const port = 3000;
    app.listen(port, () => console.log(`App launched on port ${port}`));
  } catch (e) {
    logger.error(e);
  }
})();
