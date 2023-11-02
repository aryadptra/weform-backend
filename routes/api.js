import express from "express";
import AuthController from "../controllers/AuthController.js";
import FormController from "../controllers/FormController.js";
import QuestionController from "../controllers/QuestionController.js";
import jwtAuth from "../libraries/jwtAuth.js";

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

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

router.get("/forms", jwtAuth(), FormController.index);
router.post("/forms", jwtAuth(), FormController.store);
router.get("/forms/:id", jwtAuth(), FormController.show);
router.put("/forms/:id", jwtAuth(), FormController.update);
router.delete("/forms/:id", jwtAuth(), FormController.destroy);

// router.get("/forms", jwtAuth(), QuestionController.index);
router.post("/forms/:id/questions", jwtAuth(), QuestionController.store);
// router.get("/forms/:id", jwtAuth(), QuestionController.show);
router.put(
  "/forms/:id/questions/:questionId",
  jwtAuth(),
  QuestionController.update
);
// router.delete("/forms/:id", jwtAuth(), QuestionController.destroy);

export default router;
