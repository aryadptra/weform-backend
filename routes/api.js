import express from "express";
import AuthController from "../controllers/AuthController.js";
import FormController from "../controllers/FormController.js";
import QuestionController from "../controllers/QuestionController.js";
import jwtAuth from "../libraries/jwtAuth.js";
import OptionController from "../controllers/OptionController.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  res.json({
    title: `Hello ${req.body.orang.name}, your age ${req.body.orang.age}`,
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
});

// AUTHENTICATION
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

// FORMS
router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);

// QUESTIONS
router.get("/forms/:id/questions", jwtAuth(), QuestionController.index);
router.post("/forms/:id/questions", jwtAuth(), QuestionController.store);
router.put(
  "/forms/:id/questions/:questionId",
  jwtAuth(),
  QuestionController.update
);
router.delete(
  "/forms/:id/questions/:questionId",
  jwtAuth(),
  QuestionController.destroy
);

// OPTIONS
// router.get("/forms", jwtAuth(), OptionController.index);
router.post(
  "/forms/:id/questions/:questionId/options",
  jwtAuth(),
  OptionController.store
);
// router.get("/forms/:id", jwtAuth(), OptionController.show);
router.put(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.update
);
router.delete(
  "/forms/:id/questions/:questionId/options/:optionId",
  jwtAuth(),
  OptionController.destroy
);

export default router;
