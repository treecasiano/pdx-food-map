const jwt = require("jsonwebtoken");
const set = require("lodash/set");
const uuid = require("uuid");

const iss = "pdx-food-map";

class Auth {
  constructor(config) {
    this.config = config;
  }

  async authorizeRoute(path, jwt, whiteList = []) {
    if (whiteList.find(whiteListedPath => path.match(whiteListedPath))) {
      return {
        token: jwt,
      };
    }

    if (!jwt) {
      throw new Error("No cookie set");
    }
    const payload = this.verifyJwt(jwt);

    if (path === "/session") {
      return {
        token: jwt,
        payload,
      };
    }

    const token = this.rollExp(payload);

    return {
      token,
      payload,
    };
  }

  async createJwt(user) {
    const { isLoggedIn, username } = user;

    const now = Math.floor(Date.now() / 1000);

    const registeredClaims = {
      exp: now + this.config.expWindow * 60,
      iat: now,
      iss,
      jti: uuid.v1(),
      nbf: now,
      sub: user.name,
    };

    const payload = Object.assign(
      {
        loggedIn: isLoggedIn,
        user,
        username,
      },
      registeredClaims
    );

    const token = jwt.sign(payload, this.config.secret);

    return {
      payload,
      statusCode: 200,
      token,
    };
  }

  rollExp(payload) {
    const now = Math.floor(Date.now() / 1000);
    // payload.exp = now + this.config.expWindow * 60;
    payload.exp = now + 60 * 60;
    return jwt.sign(payload, this.config.secret);
  }

  verifyJwt(token) {
    let payload;
    try {
      payload = jwt.verify(token, this.config.secret, {
        algorithms: ["HS256"],
      });
    } catch (e) {
      throw new Error("Unable to verify authentication token");
    }
    return payload;
  }
}

module.exports = Auth;