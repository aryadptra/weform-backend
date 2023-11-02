import mongoose from "mongoose";
import Form from "../models/Form.js";

class OptionController {
  //add options
  async store(req, res) {
    try {
      //check form id
      if (!req.params.id) {
        throw { code: 428, message: "FORM_ID_REQUIRED" };
      }
      if (!req.params.questionId) {
        throw { code: 428, message: "QUESTION_ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 428, message: "INVALID_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!req.body.options) {
        throw { code: 428, message: "OPTIONS_REQUIRED" };
      }

      //field
      let option = {
        id: new mongoose.Types.ObjectId(),
        value: req.body.options,
      };

      //update form
      const question = await Form.findOneAndUpdate(
        { _id: req.params.id, userId: req.jwt.payload.id },
        { $push: { "questions.$[indexQuestion].options": option } },
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
        throw { code: 500, message: "ADD_OPTIONS_FAILED" };
      }

      res.status(200).json({
        status: true,
        message: "ADD_OPTIONS_SUCCESS",
        option,
      });
    } catch (err) {
      res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}

export default new OptionController();
