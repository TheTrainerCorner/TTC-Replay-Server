import { Router } from "express";
import Replay from "../models/replay";
const router = Router();

router.route('/').post(async (req, res) => {
  const newReplay = new Replay({
    id: req.body.id,
    log: req.body.id,
    players: req.body.players,
    format: req.body.format,
    rating: req.body.rating,
    private: req.body.private,
    password: req.body.password,
    inputlog: req.body.inputlog,
    uploadtime: req.body.uploadtime,
  });

  await newReplay.save();
});
router.route('/:id').get(async(req, res)=> {
  return res.send("Success");
});

export {
  router
}