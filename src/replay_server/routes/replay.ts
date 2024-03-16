import { Router } from "express";
import Replay, { IReplay } from "./../../database/models/replay";
import axios from "axios";
import ShowdownServers from "../../database/models/ShowdownServers";
import { Config } from "../../global/config";
const router = Router();

router
  .route("/:name").post(async (req, res) => {
    let server = await ShowdownServers.findOne({ path_name: req.params.name });

    if (!server) {
      return res
        .status(401)
        .send(
          "Your server is not authorized to use our replay server. Please join the TTC discord server and talk to Koreanpanda345 in order to use our replay server!"
        );
    }

    if (!req.body.id) return res.sendStatus(400);
    if (!req.body.log) return res.sendStatus(400);
    if (!req.body.players) return res.sendStatus(400);
    if (!req.body.format) return res.sendStatus(400);
    if (!req.body.rating) return res.sendStatus(400);
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
      path_name: req.params.name,
    });
    await newReplay.save();
  });
router.route("/:name/:id").get(async (req, res) => {
  let server = await ShowdownServers.findOne({ path_name: req.params.name });

  if (!server) {
    return res
      .status(404)
      .send(
        "There is not a server that goes by that path name. Please make sure you are using the correct path name. If you would like to use our replay server, then please TTC's discord server and speak to Koreanpanda345."
      );
  }

  const replay = await Replay.findOne<IReplay>({
    id: req.params.id,
    path_name: req.params.name,
  }).exec();
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
router
  .route("/")
  .get(async (req, res) => {
    let buf = "<!doctype html>";
    buf += `<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>TTC | Replay Home</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></head>`;
    buf += `<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="https://main.thetrainercorner.net">
        The Trainer's Corner
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="https://play.thetrainercorner.net">Main Server</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://test.thetrainercorner.net">Test Server</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Replay Server</a>
          </li>
        </ul>
      </div>
    </div>
</nav>
    `;
    buf += `<div class="container text-center">\n`;
    buf += `<h1>The Trainer's Corner</h1>\n`;
    let servers = await ShowdownServers.find();
    buf += `<h2>Server List</h2>\n`;
    buf += `<p>If you would like to use our replay server, then please join our discord server and talk to koreanpanda345!</p>\n`;
    buf += `<div class="btn-group pb-2 mb-2" role="group" aria-label="Server Lists">\n`;
    for (let server of servers) {
      if (server.path_name !== "ttc")
        buf += `<a href="${Config.REPLAY_SERVER_URL}/${server.path_name}" class="btn btn-primary">${server.server_name}</a>\n`;
    }
    buf += `</div>\n`;
    let replays = await Replay.find({ path_name: undefined });
    replays = replays.reverse();
    let amount = replays.length >= 25 ? replays.length : 25;
    for (let i = 0; i < amount; i++) {
      const replay = replays.at(i);
      if (replay?.format !== undefined) {
        buf += `<div class="card">\n`;
        buf += `<div class="card-body">\n`;
        buf += `<h5 class="card-title">${replay!.players[0]} VS ${
          replay!.players[1]
        }</h5>\n`;
        buf += `<h6 class="card-subtitle mb-2 text-body-secondary">Format: ${
          replay!.format
        }</h6>\n`;
        buf += `<a href="${Config.REPLAY_SERVER_URL}/${replay?.id}">Watch Replay</a>\n`;
        buf += `</div>\n`;
        buf += `</div>\n`;
      }
    }

    buf += `</div>\n`;
    buf += `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>\n`;
    buf += `</body>\n`;
    buf += `</html>\n`;
    return res.status(200).send(buf);
  })
  .post(async (req, res) => {
    if (!req.body.id) return res.sendStatus(400);
    if (!req.body.log) return res.sendStatus(400);
    if (!req.body.players) return res.sendStatus(400);
    if (!req.body.format) return res.sendStatus(400);
    if (!req.body.rating) return res.sendStatus(400);
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
      path_name: "ttc",
    });
    await newReplay.save();
    await axios.post("https://main.thetrainercorner.net/api/discord/replay", {
      replay_id: req.body.id,
    });
  });
router.route("/:id").get(async (req, res) => {
  const replay = await Replay.findOne<IReplay>({ id: req.params.id }).exec();
  if (!replay) {
    let server = await ShowdownServers.findOne({ path_name: req.params.id });

    if (!server) {
      return res
        .status(404)
        .send(`
<h1>There doesn't seem to be a server or replay under that.</h1>
<h2>If you would like to use our replay server, then please join our discord server and talk to koreanpanda345!</h2>
        `);
    }
    let buf = "<!doctype html>";
    buf += `<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>TTC | Replay Home</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous"></head>`;
    buf += `<nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        ${server.server_name}
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" href="${server.server_url}">Showdown Server</a>
          </li>
          ${
            server.test_server_url ?
            `<li class="nav-item"><a class="nav-link" href="${server.test_server_url}">Test Server</a></li>` :
            ``
          }
          <li class="nav-item">
            <a class="nav-link disabled" aria-disabled="true">Replay Server</a>
          </li>
        </ul>
      </div>
    </div>
</nav>
    `;
    buf += `<div class="container text-center">\n`;
    buf += `<h1>${server.server_name}</h1>\n`;
    let replays = await Replay.find({ path_name: req.params.id });
    replays = replays.reverse();
    let amount = replays.length >= 25 ? replays.length : 25;
    for (let i = 0; i < amount; i++) {
      const replay = replays.at(i);
      if (replay?.format !== undefined) {
        buf += `<div class="card">\n`;
        buf += `<div class="card-body">\n`;
        buf += `<h5 class="card-title">${replay!.players[0]} VS ${
          replay!.players[1]
        }</h5>\n`;
        buf += `<h6 class="card-subtitle mb-2 text-body-secondary">Format: ${
          replay!.format
        }</h6>\n`;
        buf += `<a href="${Config.REPLAY_SERVER_URL}/${req.params.id}/${replay?.id}">Watch Replay</a>\n`;
        buf += `</div>\n`;
        buf += `</div>\n`;
      }
    }

    buf += `</div>\n`;
    buf += `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>\n`;
    buf += `</body>\n`;
    buf += `</html>\n`;
    return res.status(200).send(buf);
  } else {
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
  }
});

export { router };
