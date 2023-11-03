import mongoose from "mongoose";
import Form from "../models/Form.js";
import User from "../models/User.js";

class FormController {
  async index(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      const form = await Form.paginate(
        {
          userId: req.jwt.payload.id,
        },
        { limit: limit, page: page }
      );
      if (!form) {
        throw { code: 404, nessage: "FORM_NOT_FOUND" };
      }
      return res.status(200).json({
        status: true,
        message: "FORM_FOUND",
        total: form.length,
        form,
      });
    } catch (error) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async store(req, res) {
    try {
      const form = await Form.create({
        userId: req.jwt.payload.id,
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
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async show(req, res) {
    try {
      // Validation request
      if (!req.params.id) {
        throw {
          code: 428,
          message: "ID_FORM_REQUIRED",
        };
      }

      // Validation data form request
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw {
          code: 428,
          message: "INVALID_ID_FORM",
        };
      }

      // Find data from request using _id and userId
      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.payload.id,
      });

      //
      if (!form) {
        throw {
          code: 404,
          message: "FORM_NOT_FOUND",
        };
      }

      return res.status(200).json({
        status: true,
        message: "FORM_FOUND",
        form,
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
      // Validation request
      if (!req.params.id) {
        throw {
          code: 428,
          message: "ID_FORM_REQUIRED",
        };
      }

      // Validation data form request
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw {
          code: 428,
          message: "INVALID_ID_FORM",
        };
      }

      const form = await Form.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.jwt.payload.id,
        },
        req.body,
        { new: true }
      );

      if (!form) {
        throw { code: 404, message: "FORM_UPDATE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "FORM_SUCESS_UPDATED",
        form,
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
      // Validation request
      if (!req.params.id) {
        throw {
          code: 428,
          message: "ID_FORM_REQUIRED",
        };
      }

      // Validation data form request
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw {
          code: 428,
          message: "INVALID_ID_FORM",
        };
      }

      const form = await Form.findOneAndDelete({
        _id: req.params.id,
        userId: req.jwt.payload.id,
      });

      if (!form) {
        throw { code: 404, message: "FORM_DELETE_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "FORM_SUCESS_DELETED",
      });
    } catch (err) {
      return res.status(err.code || 500).json({
        status: false,
        message: err.message,
      });
    }
  }

  async showToUser(req, res) {
    try {
      if (!req.params.id) {
        throw {
          code: 400,
          message: "REQUIRED_FORM_ID",
        };
      }

      if (!new mongoose.Types.ObjectId(req.params.id)) {
        {
          throw { code: 400, message: "INVALID_ID" };
        }
      }

      const form = await Form.findOne({
        _id: req.params.id,
      });

      if (!form) {
        throw { code: 404, message: "FORM_NOT_FOUND" };
      }

      //if is not form owner && is not public
      if (req.jwt.payload.id != form.userId && form.public === false) {
        //get email from jwt
        const user = await User.findOne({ _id: req.jwt.payload.id });

        //then check is user invited
        if (!form.invites.includes(User.email)) {
          throw { code: 401, message: "YOU_ARE_NOT_INVITED" };
        }
      }

      //reset invites supaya bukan pemilik form gak bisa lihat email-email ini
      form.invites = [];

      res.status(200).json({
        status: true,
        message: "FORM_FOUND",
        form,
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

export default new FormController();
