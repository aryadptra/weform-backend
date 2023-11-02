import mongoose from "mongoose";
import Form from "../models/Form.js";

const allowedTypes = ["Text", "Email", "Radio", "Checkbox", "Dropdown"];

class QuestionController {
  async index(req, res) {
    try {
      const form = await Form.findOne({ _id: req.params.id }).select(
        "questions"
      );
      if (!form) {
        throw { code: 404, message: "QUESTION_NOT_FOUND" };
      }

      res.status(200).json({
        status: true,
        form,
      });
    } catch (err) {
      if (!err.code) {
        err.code = 500;
      }
      res.status(err.code).json({
        status: false,
        message: err.message,
        index: err.index,
      });
    }
  }

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

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "FORM_ID_REQUIRED" };
      }

      if (!req.params.questionId) {
        throw { code: 400, message: "QUESTION_ID_REQUIRED" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVAlID_FORM_id" };
      }

      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_QUESTION_ID" };
      }

      let field = {};
      if (req.body.hasOwnProperty("question")) {
        field["questions.$[indexQuestion].question"] = req.body.question;
      } else if (req.body.hasOwnProperty("required")) {
        field["questions.$[indexQuestion].required"] = req.body.required;
      } else if (req.body.hasOwnProperty("type")) {
        if (!allowedTypes.includes(req.body.type)) {
          throw { code: 400, message: "INVALID_TYPE" };
        }
        field["questions.$[indexQuestion].type"] = req.body.type;
      }

      const question = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.payload.id,
        },
        {
          $set: field,
        },
        {
          arrayFilters: [
            {
              "indexQuestion.id": new mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
          new: true,
        }
      );

      if (!question) {
        throw {
          code: 400,
          message: "QUESTION_UPDATE_FAILED",
        };
      }

      return res.status(200).json({
        status: true,
        message: "QUESTION_UPDATE_SUCCESS",
        question,
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.payload.id },
        {
          $pull: {
            questions: {
              id: new mongoose.Types.ObjectId(req.params.questionId),
            },
          },
        },
        {
          new: true,
        }
      );
      if (!question) {
        throw { code: 500, message: "DELETE_QUESTION_FAILED" };
      }

      res.status(200).json({
        status: true,
        message: "DELETE_QUESTION_SUCCESS",
        question,
      });
    } catch (err) {
      if (!err.code) {
        err.code = 500;
      }
      res.status(err.code).json({
        status: false,
        message: err.message,
      });
    }
  }
}

export default new QuestionController();
