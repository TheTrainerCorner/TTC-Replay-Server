import Axios from 'axios';
import Router from 'koa-router';
import { renderReplayTemplate } from '../templates';

const getReplay = async (id: string, password?: string) => {
  try {
    const {data} = await Axios.post('https://clover.weedl.es/~~clodown/api/getreplay', {
      id,
      password,
    }, { responseType: 'text' });
  
    if (data.startsWith(']')) {
      return JSON.parse(data.substring(1)).replay;
    }
  } catch {}

  return undefined;
};

const parseReplayId = (id: string) => {
  let currentId = id;

  if (id.endsWith('pw')) {
    currentId = currentId.substring(0, currentId.length - 2); // Strip 'pw'
    const lastDashIndex = id.lastIndexOf('-'); // Find last dash
    const password = id.substring(lastDashIndex + 1); // Extract password
    currentId = currentId.substring(0, lastDashIndex); // Extract id portion
    return [currentId, password];
  }

  return [currentId];
};

const createReplaysRouter = () => {
  const router = new Router();

  router.get('/:replayId.json', async (ctx) => {
    if (!ctx.params.replayId) {
      ctx.status = 400;
      ctx.body = 'No replay id specified.';
      return;
    }

    const [id, password] = parseReplayId(ctx.params.replayId);
    const replay = await getReplay(id, password);

    if (!replay) {
      ctx.status = 404;
      ctx.body = 'No replay found.';
      return;
    }

    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.body = JSON.stringify(replay);
  });

  router.get('/:replayId.log', async (ctx) => {
    if (!ctx.params.replayId) {
      ctx.status = 400;
      ctx.body = 'No replay id specified.';
      return;
    }

    const [id, password] = parseReplayId(ctx.params.replayId);
    const replay = await getReplay(id, password);

    if (!replay) {
      ctx.status = 404;
      ctx.body = 'No replay found.';
      return;
    }

    ctx.status = 200;
    ctx.body = replay.log;
  });

  router.get('/:replayId', async (ctx) => {
    if (!ctx.params.replayId) {
      ctx.status = 400;
      ctx.body = 'No replay id specified.';
      return;
    }

    const [id, password] = parseReplayId(ctx.params.replayId);
    const replay = await getReplay(id, password);

    if (!replay) {
      ctx.status = 404;
      ctx.body = 'No replay found.';
      return;
    }

    ctx.type = 'html';
    ctx.body = renderReplayTemplate({
      rootUrl: 'https://clover.weedl.es',
      id: replay.id,
      format: replay.format,
      p1Id: replay.p1id,
      p1Name: replay.p1,
      p2Id: replay.p2id,
      p2Name: replay.p2,
      battleLog: replay.log,
    });
  });

  return router;
};

export default createReplaysRouter;