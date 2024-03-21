import { Router } from "express";
import axios from "axios";
import ShowdownServers from "../../database/models/ShowdownServers";
import { Config } from "../../global/config";
import Replay, { IReplay } from "./../../database/models/replay";

export const router = Router();
router
  .route("/:path_name")
  .post(async (req, res) => {
    const server = await ShowdownServers.findOne({
      path_name: req.params.path_name,
    });

    if (!server) {
      return res
        .status(401)
        .send(
          `Your server is not authorized to use our replay server!\nPlease join the TTC discord server and talk to Koreanpanda345 in order to use our replay server!`
        );
    }

    if (!req.body.id)
      return res
        .status(400)
        .send("The requested replay that was recieved did not contain an id!");
    if (!req.body.log)
      return res
        .status(400)
        .send(`The requested replay (${req.body.id}) is missing the log data!`);
    if (!req.body.players)
      return res
        .status(400)
        .send(
          `The requested replay (${req.body.id}) is missing the players data`
        );
    if (!req.body.format)
      return res
        .status(400)
        .send(
          `The requested replay (${req.body.id}) is missing the format data!`
        );
    if (!req.body.rating) req.body.rating = 0;

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
      path_name: req.params.path_name,
    });
    await newReplay.save();

    if (server.path_name === "ttc") {
      await axios.post("https://main.thetrainercorner.net/api/discord/replay", {
        replay_id: req.body.id,
      });
    }
  })
  .get(async (req, res) => {
    const server = await ShowdownServers.findOne({
      path_name: req.params.path_name,
    });
    if (!server) {
      return res.status(404).send(`
  <h1>There doesn't seem to be a server or replay under that.</h1>
  <h2>If you would like to use our replay server, then please join our discord server and talk to koreanpanda345!</h2>
		  `);
    }
    const replays = await Replay.find({ path_name: req.params.path_name });
    return res.status(200).render("server.pug", {
      server: server,
      replays: replays,
    });
  });

router.route("/:path_name/:id").get(async (req, res) => {
  let server = await ShowdownServers.findOne({
    path_name: req.params.path_name,
  });
  if (!server) {
    return res.status(404).send(`
  <h1>There doesn't seem to be a server or replay under that.</h1>
  <h2>If you would like to use our replay server, then please join our discord server and talk to koreanpanda345!</h2>
		  `);
  }
  let replay = await Replay.findOne<IReplay>({
    id: req.params.id,
    path_name: server?.path_name,
  }).exec();

  if (!replay) {
    if (server.path_name === "ttc") {
      replay = await Replay.findOne<IReplay>({
        id: req.params.id,
        path_name: undefined,
      });
    }
    if (!replay) {
      return res
        .status(404)
        .send(`That replay doesn't seem to exist for this showdown server.`);
    }
  }
  let buf = "<!DOCTYPE html>\n";
  buf += '<meta charset="utf-8" />\n';
  buf += "<!-- version 1 -->\n";
  buf += `<title>${replay.format} replay: ${replay.players[0]} vs. ${replay.players[1]}</title>\n`;
  buf += `<a href="https://replay.thetrainercorner.net/${
    replay.path_name || "ttc"
  }"><button>Back to replay server</button></a>\n`;
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
