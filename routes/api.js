import express from "express";

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

export default router;
