import User from "../models/User.js";
import emailExist from "../libraries/emailExists.js";
import bcrypt from "bcrypt";
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
}

export default new AuthController();
