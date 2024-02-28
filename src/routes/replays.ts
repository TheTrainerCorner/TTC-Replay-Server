import { Router } from "express";
import Replay, { IReplay } from "../models/replay";
const router = Router();

router.route('/').post(async (req, res) => {
  console.debug(req);
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

  await newReplay.save();
});
router.route('/:id').get(async(req, res)=> {
  const replay = await Replay.findOne<IReplay>({id: req.params.id}).exec();
  if (!replay) {
    res.status(404).send("Could not find that replay");
    return;
  }
  let buf = '<!DOCTYPE html>\n';
		buf += '<meta charset="utf-8" />\n';
		buf += '<!-- version 1 -->\n';
		buf += `<title>${replay.format} replay: ${replay.players[0]} vs. ${replay.players[1]}</title>\n`;
		buf += '<div class="wrapper replay-wrapper" style="max-width:1180px;margin:0 auto">\n';
		buf += '<div class="battle"></div><div class="battle-log"></div><div class="replay-controls"></div><div class="replay-controls-2"></div>\n';
		buf += `<h1 style="font-weight:normal;text-align:center"><strong>${replay.format}</strong><br /><a href="https://pokemonshowdown.com/users/${replay.players[0]}" class="subtle" target="_blank">${replay.players[0]}</a> vs. <a href="https://pokemonshowdown.com/users/${replay.players[1]}" class="subtle" target="_blank">${replay.players[1]}</a></h1>\n`;
		buf += '<script type="text/plain" class="battle-log-data">' + replay.log.replace(/\//g, '\\/') + '</script>\n';
		buf += '</div>\n';
		buf += '</div>\n';
		buf += '<script>\n';
		buf += `let daily = Math.floor(Date.now()/1000/60/60/24);`
    + `document.write('`
    + `<script src="https://play.thetrainercorner.net/js/replay-embed.js?version'+daily+'"></script>`
    + `<script src="https://play.pokemonshowdown.com/js/replay-embed.js?version'+daily+'"></script>');\n`;
		buf += '</script>\n';
    return res.status(200).send(buf);
});

export {
  router
}