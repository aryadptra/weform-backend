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
      if (!req.params.optionId) {
        throw { code: 428, message: "OPTION_ID_REQUIRED" };
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

  // async update(req, res) {
  //   try {
  //     //check form id
  //     if (!req.params.id) {
  //       throw { code: 428, message: "FORM_ID_REQUIRED" };
  //     }
  //     if (!req.params.questionId) {
  //       throw { code: 428, message: "QUESTION_ID_REQUIRED" };
  //     }
  //     if (!req.params.optionId) {
  //       throw { code: 428, message: "OPTION_ID_REQUIRED" };
  //     }
  //     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
  //       throw { code: 400, message: "INVALID_ID" };
  //     }
  //     if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
  //       throw { code: 428, message: "INVALID_QUESTION_ID" };
  //     }
  //     if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
  //       throw { code: 400, message: "INVALID_OPTION_ID" };
  //     }
  //     if (!req.body.option) {
  //       throw { code: 428, message: "OPTION_REQUIRED" };
  //     }

  //     const form = await Form.findOneAndUpdate(
  //       {
  //         _id: req.params.id,
  //         userId: req.jwt.payload.id,
  //       },
  //       {
  //         $set: {
  //           "questions.$[indexQuestion].options.$[indexOption].value":
  //             req.body.option,
  //         },
  //       },
  //       {
  //         arrayFilters: [
  //           {
  //             "indexQuestion.id": new mongoose.Types.ObjectId(
  //               req.params.questionId
  //             ),
  //           },
  //           {
  //             "indexOption.id": new mongoose.Types.ObjectId(
  //               req.params.optionId
  //             ),
  //           },
  //         ],
  //         new: true,
  //       }
  //     );

  //     if (!form) {
  //       throw {
  //         code: 400,
  //         message: "UPDATE_OPTION_FAILED",
  //       };
  //     }

  //     res.status(200).json({
  //       status: true,
  //       message: "SUCCESS_UPDATE_OPTION",
  //       option: { id: req.params.optionId, value: req.body.option },
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(err.code || 500).json({
  //       status: false,
  //       message: err.message,
  //     });
  //   }
  // }
  async update(req, res) {
    try {
      // Check form id
      if (!req.params.id) {
        throw { code: 428, message: "FORM_ID_REQUIRED" };
      }
      if (!req.params.questionId) {
        throw { code: 428, message: "QUESTION_ID_REQUIRED" };
      }
      if (!req.params.optionId) {
        throw { code: 428, message: "OPTION_ID_REQUIRED" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 428, message: "INVALID_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 400, message: "INVALID_OPTION_ID" };
      }
      if (!req.body.option) {
        throw { code: 428, message: "OPTION_REQUIRED" };
      }

      // Find the form
      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.payload.id,
      });

      if (!form) {
        throw {
          code: 400,
          message: "FORM_NOT_FOUND",
        };
      }

      // Find the question and option to update
      const questionIndex = form.questions.findIndex(
        (question) => question.id.toString() === req.params.questionId
      );

      if (questionIndex === -1) {
        throw {
          code: 400,
          message: "QUESTION_NOT_FOUND",
        };
      }

      const optionIndex = form.questions[questionIndex].options.findIndex(
        (option) => option.id.toString() === req.params.optionId
      );

      if (optionIndex === -1) {
        throw {
          code: 400,
          message: "OPTION_NOT_FOUND",
        };
      }

      // Update the option value
      form.questions[questionIndex].options[optionIndex].value =
        req.body.option;

      const updateFields = {
        $set: {
          questions: form.questions, // Update the "questions" array
        },
      };

      // Find and update the form
      await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.payload.id,
        },
        updateFields,
        { new: true } // To return the updated document
      );

      res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_OPTION",
        option: { id: req.params.optionId, value: req.body.option },
      });
    } catch (err) {
      console.log(err);
      res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }
}

export default new OptionController();
