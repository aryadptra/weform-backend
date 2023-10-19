import User from "../models/User.js";

class AuthController {
  async register(req, res) {
    try {
      if (!req.body.fullname) {
        throw { code: 428, message: "FULLNAME_IS_REQUIRED" };
      }

      if (!req.body.email) {
        throw { code: 428, message: "EMAIL_IS_REQUIRED" };
      }

      if (!req.body.password) {
        throw { code: 428, message: "PASSWORD_IS_REQUIRED" };
      }

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
