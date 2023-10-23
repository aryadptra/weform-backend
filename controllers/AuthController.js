import dotenv from "dotenv";
import User from "../models/User.js";
import emailExist from "../libraries/emailExists.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

const env = dotenv.config().parsed;

/**
 *
 * @param payload
 * function to generate access token and refresh token
 * @returns
 */
const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(
    {
      payload,
    },
    env.JWT_ACCESS_SECRET_KEY,
    {
      expiresIn: env.JWT_ACCESS_EXPIRATION_TIME,
    }
  );
};

const generateRefreshToken = async (payload) => {
  return jsonwebtoken.sign(
    {
      payload,
    },
    env.JWT_REFRESH_SECRET_KEY,
    {
      expiresIn: env.JWT_REFRESH_EXPIRATION_TIME,
    }
  );
};
class AuthController {
  async register(req, res) {
    try {
      // request validation
      if (!req.body.fullname) {
        throw { code: 428, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 428, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 428, message: "PASSWORD_IS_REQUIRED" };
      }
      if (req.body.password.length < 6) {
        throw { code: 428, message: "PASSWORD_MINIMUM_6_CHARACTERS" };
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      //check is email exist
      const isEmailExist = await emailExist(req.body.email);
      if (isEmailExist) {
        throw { code: 409, message: "EMAIL_ALEREADY_EXIST" };
      }

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });

      if (!user) {
        throw {
          code: 500,
          message: "USER_REGISTER_FAILED",
        };
      }
      return res.status(200).json({
        status: "success",
        message: "USER_REGISTER_SUCCESS",
        data: user,
      });
    } catch (err) {
      return res
        .status(err.code || 500)
        .json({ status: false, message: err.message });
    }
  }

  async login(req, res) {
    try {
      if (!req.body.email) {
        throw {
          code: 424,
          message: "EMAIL_IS_REQUIRED",
        };
      }
      if (!req.body.password) {
        throw {
          code: 428,
          message: "PASSWORD_IS_REQUIRED",
        };
      }

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw {
          code: 404,
          message: "USER_NOT_FOUND",
        };
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw {
          code: 428,
          message: "PASSWORD_INVALID",
        };
      }

      // create payload, id: user.id
      // you can change other payloads here
      let payload = { id: user.id };
      const refreshToken = await generateRefreshToken(payload);
      const accessToken = await generateAccessToken(payload);

      return res.status(200).json({
        status: true,
        message: "LOGIN_SUCCESS",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (err) {
      return res
        .status(err.code || 500)
        .json({ status: false, message: err.message });
    }
  }

  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw {
          code: 428,
          message: "REFRESH_TOKEN_IS_REQUIRED",
        };
      }

      // verify refresh token
      const verify = await jsonwebtoken.verify(
        req.body.refreshToken,
        env.JWT_ACCESS_SECRET_KEY
      );

      // create payload, id: user.id
      // you can change other payloads here
      let payload = { id: verify.id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFRESH_TOKEN_IS_SUCCESSFUL",
        accessToken,
        refreshToken,
      });
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

        // if error message includes on array
      } else if (errorJwt.includes(err.message)) {
        {
          err.message = "INVALID_REFRESH_TOKEN";
        }
        return res.status(err.code || 500).json({
          status: false,
          message: err.message,
        });
      }
    }
  }
}

export default new AuthController();
