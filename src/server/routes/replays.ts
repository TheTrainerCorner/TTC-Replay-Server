import { Router } from "express";
import Replay, { IReplay } from "../models/replay";
import { discordClient } from "../../global/constants";
const router = Router();

router.route("/").get(async (req, res) => {
  let buf = "<!doctype html>";
  buf += `<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>TTC | Replay Home</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></head>`;
  buf += `<body><ul class="nav justify-content-center"><li class="nav-item"><a class="nav-link active" aria-current="page" href="https://play.thetrainercorner.net">Main Server</a></li><li class="nav-item"><a class="nav-link" href="https://test.thetrainercorner.net">Test Server</a></li><li class="nav-item"><a class="nav-link" href="https://dex.thetrainercorner.net">Dex Site</a></li><li class="nav-item"><a class="nav-link disabled" aria-disabled="true">Replay Server</a></li></ul>`;
  buf += `<div class="container text-center">\n`;
  
  const replays = await Replay.find();
  let amount = replays.length >= 25 ? replays.length : 25
  for (let i = 0; i < amount; i++) {
    buf += `<div class="row">\n`;
    const replay = replays.at(i);
    buf += `<div class="card">\n`;
    buf += `<div class="card-body">\n`;
    buf += `<h5 class="card-title">${replay!.players[0]} VS ${replay!.players[1]}</h5>\n`;
    buf += `<h6 class="card-subtitle mb-2 text-body-secondary">Format: ${replay!.format}</h6>\n`;
    buf += `<a href="https://replay.thetrainercorner.net/${replay?.id}">Watch Replay</a>\n`;
    buf += `</div>\n`;
    buf += `</div>\n`;

  }
  buf += `</div>\n`;
  buf += `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>\n`;
  buf += `</body>\n`;
  buf += `</html>\n`;
});

router.route("/").post(async (req, res) => {
  console.debug(req.headers.host);
  const newReplay = new Replay({
    id: req.body.id,
    log: req.body.log,
    players: req.body.players,
    format: req.body.format,
    rating: req.body.rating,
    private: req.body.private,
    password: req.body.password,
    inputlog: req.body.inputlog,
    uploadtime: req.body.uploadtime,
  });
  discordClient.emit("sendReplay", newReplay);
  await newReplay.save();
});
router.route("/:id").get(async (req, res) => {
  const replay = await Replay.findOne<IReplay>({ id: req.params.id }).exec();
  if (!replay) {
    res.status(404).send("Could not find that replay");
    return;
  }
  let buf = "<!DOCTYPE html>\n";
  buf += '<meta charset="utf-8" />\n';
  buf += "<!-- version 1 -->\n";
  buf += `<title>${replay.format} replay: ${replay.players[0]} vs. ${replay.players[1]}</title>\n`;
  buf +=
    '<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">\n';
  buf +=
    '<div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>\n';
  buf += `<h1 style="font-weight:normal;text-align:center"><strong>${replay.format}</strong><br /><a href="https://pokemonshowdown.com/users/${replay.players[0]}" class="subtle" target="_blank">${replay.players[0]}</a> vs. <a href="https://pokemonshowdown.com/users/${replay.players[1]}" class="subtle" target="_blank">${replay.players[1]}</a></h1>\n`;
  buf +=
    '<script type="text/plain" class="battle-log-data">' +
    replay.log.replace(/\//g, "\\/") +
    "</script>\n";
  buf += "</div>\n";
  buf += "</div>\n";
  buf += "<script>\n";
  buf +=
    `let daily = Math.floor(Date.now()/1000/60/60/24);` +
    `document.write('` +
    `<script src="https://play.thetrainercorner.net/js/replay-embed.js?version'+daily+'"></script>` +
    `<script src="https://play.pokemonshowdown.com/js/replay-embed.js?version'+daily+'"></script>');\n`;
  buf += "</script>\n";

  return res.status(200).send(buf);
});

export { router };
