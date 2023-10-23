import express from "express";
import AuthController from "../controllers/AuthController.js";
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

export default router;
