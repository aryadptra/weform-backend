import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw {
          code: 400,
          message: "REQUIRED_FORM_ID",
        };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw {
          code: 400,
          message: "INVALID_FORM_ID",
        };
      }

      let fields = {};
      req.body.answers.forEach((answers) => {
        fields[answers.questionId] = answers.value;
      });

      const answers = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.payload.id,
        ...fields,
      });

      if (!answers) {
        throw {
          code: 400,
          message: "ANSWER_FAILED",
        };
      }

      return res.status(200).json({
        status: true,
        message: "ANSWER_SUCCESS",
        answers,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
}

export default new AnswerController();
