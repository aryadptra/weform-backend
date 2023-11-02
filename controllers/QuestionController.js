import mongoose from "mongoose";
import Form from "../models/Form.js";

class QuestionController {
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM_ID_REQUIRED" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const newQuestion = {
        id: new mongoose.Types.ObjectId(),
        question: null,
        type: "Text",
        required: false,
        options: [],
      };

      // update form
      const form = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.payload.id,
        },
        {
          $push: {
            questions: newQuestion,
          },
        },
        {
          new: true,
        }
      );

      if (!form) {
        throw {
          code: 400,
          message: "FAILED_UPDATE_FORM",
        };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_ADD_QUESTION",
        question: newQuestion,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}

export default new QuestionController();
