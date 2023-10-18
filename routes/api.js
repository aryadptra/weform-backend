import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.get("/", (req, res) => {
  console.log(req.body);
  res.json({
    title: `Hello ${req.body.orang.name}, your age ${req.body.orang.age}`,
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
  console.log(req);
});

router.post("/register", AuthController.register);

export default router;
