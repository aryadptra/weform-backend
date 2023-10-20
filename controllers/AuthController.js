import User from "../models/User.js";
import emailExist from "../libraries/emailExists.js";
class AuthController {
  async register(req, res) {
    try {
      // request validation
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }

      const emailValidation = emailExist(req.body.email);
      if (emailValidation) {
        throw {
          code: 409,
          message: "EMAIL_ALREADY_EXIST",
        };
      }

      //   const email = User.findOne({ email: req.body.email });
      //   if (email) {
      //     throw { code: 400, message: "EMAIL_ALREADY_EXIST" };
      //   }

      const user = await User.create(req.body);
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
}

export default new AuthController();
