import Axios from 'axios';
import Router from 'koa-router';
import { renderUserTemplate } from '../templates';

const getUser = async (username: string) => {
  try {
    const {data} = await Axios.post('https://clover.weedl.es/~~clodown/api/getuser', {
      username,
    }, { responseType: 'text' });
  
    if (data.startsWith(']')) {
      return JSON.parse(data.substring(1)).user;
    }
  } catch {}

  return undefined;
};

const createUsersRouter = () => {
  const router = new Router();

  router.get('/:username.json', async (ctx) => {
    if (!ctx.params.username) {
      ctx.status = 400;
      ctx.body = 'No user specified.';
      return;
    }

    const user = await getUser(ctx.params.username);

    if (!user) {
      ctx.status = 404;
      ctx.body = 'No user found.';
      return;
    }

    ctx.status = 200;
    ctx.type = 'application/json';
    ctx.body = JSON.stringify(user);
  });

  router.get('/:username', async (ctx) => {
    if (!ctx.params.username) {
      ctx.status = 400;
      ctx.body = 'No user specified.';
      return;
    }

    const user = await getUser(ctx.params.username);

    if (!user) {
      ctx.status = 404;
      ctx.body = 'No user found.';
      return;
    }

    ctx.type = 'html';
    ctx.body = renderUserTemplate(JSON.stringify(user));
  });

  return router;
};

export default createUsersRouter;