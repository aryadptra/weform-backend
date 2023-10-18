import User from "../models/User.js";

class AuthController {
  async register(req, res) {
    try {
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
