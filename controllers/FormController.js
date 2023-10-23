import mongoose from "mongoose";
import Form from "../models/Form.js";

class FormController {
  async store(req, res) {
    try {
      const form = await Form.create({
        user_id: req.jwt.id,
        title: "Untitled Form",
        description: null,
        public: true,
      });

      if (!form) {
        throw {
          code: 500,
          message: "FAILED_CREATED_FORM",
        };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATED_FORM",
        form,
      });
    } catch (err) {
      return res.status(error.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}
