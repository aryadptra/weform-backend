import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";

const env = dotenv.config().parsed;

const jwtAuth = () => {
  return async (req, res, next) => {
    try {
      // if user headers are not set authorization
      if (!req.headers.authorization) {
        throw {
          code: 401,
          message: "UNAUTHORIZED",
        };
      }

      /**
       * Get access token from headers
       * example of result : Bearer <token>
       * token is on 1 array
       */
      const token = req.headers.authorization.split(" ")[1];
      const verify = jsonwebtoken.verify(token, env.JWT_ACCESS_SECRET_KEY);
      req.jwt = verify;
      next(); // continue processing another middleware, or next to controller
    } catch (err) {
      // create error message using array
      const errorJwt = [
        "invalid signature",
        "jwt mailformed",
        "jwt must be provided",
        "invalid token",
      ];

      if (err.message == "jwt expired") {
        err.message = "REFRESH_TOKEN_EXPIRED";
      } else if (errorJwt.includes(err.message)) {
        err.message = "INVALID_REFRESH_TOKEN";
      }

      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  };
};

export default jwtAuth;
