import { Router } from "express";
import Replay, { IReplay } from "../../database/models/replay";
import axios from "axios";
import ShowdownServers from "../../database/models/ShowdownServers";
import { Config } from "../../global/config";
const router = Router();

// router.route("/:name/:id").get(async (req, res) => {
//   let server = await ShowdownServers.findOne({ path_name: req.params.name });

//   if (!server) {
//     return res
//       .status(404)
//       .send(
//         "There is not a server that goes by that path name. Please make sure you are using the correct path name. If you would like to use our replay server, then please TTC's discord server and speak to Koreanpanda345."
//       );
//   }

//   const replay = await Replay.findOne<IReplay>({
//     id: req.params.id,
//     path_name: req.params.name,
//   }).exec();
//   if (!replay) {
//     res.status(404).send("Could not find that replay");
//     return;
//   }
//   let buf = "<!DOCTYPE html>\n";
//   buf += '<meta charset="utf-8" />\n';
//   buf += "<!-- version 1 -->\n";
//   buf += `<title>${replay.format} replay: ${replay.players[0]} vs. ${replay.players[1]}</title>\n`;
//   buf +=
//     '<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">\n';
//   buf +=
//     '<div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>\n';
//   buf += `<h1 style="font-weight:normal;text-align:center"><strong>${replay.format}</strong><br /><a href="https://pokemonshowdown.com/users/${replay.players[0]}" class="subtle" target="_blank">${replay.players[0]}</a> vs. <a href="https://pokemonshowdown.com/users/${replay.players[1]}" class="subtle" target="_blank">${replay.players[1]}</a></h1>\n`;
//   buf +=
//     '<script type="text/plain" class="battle-log-data">' +
//     replay.log.replace(/\//g, "\\/") +
//     "</script>\n";
//   buf += "</div>\n";
//   buf += "</div>\n";
//   buf += "<script>\n";
//   buf +=
//     `let daily = Math.floor(Date.now()/1000/60/60/24);` +
//     `document.write('` +
//     `<script src="https://play.thetrainercorner.net/js/replay-embed.js?version'+daily+'"></script>` +
//     `<script src="https://play.pokemonshowdown.com/js/replay-embed.js?version'+daily+'"></script>');\n`;
//   buf += "</script>\n";

//   return res.status(200).send(buf);
// });
router
  .route("/")
  .get(async (req, res) => {
	const main = await ShowdownServers.findOne({path_name: "ttc"});
	const servers = await ShowdownServers.find();
    return res.status(200).render("index.pug", {
		main,
		servers
	});
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

export { router };
