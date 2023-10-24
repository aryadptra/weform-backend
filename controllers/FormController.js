import Form from "../models/Form.js";

class FormController {
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
      console.error(err);
    }
  }
}

export default new FormController();
