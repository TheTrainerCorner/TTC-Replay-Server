import { readFileSync } from 'fs';
import { join } from 'path';
import { compile } from 'handlebars';

const replayTemplate = compile(readFileSync(join(__dirname, 'replay.html.hbs'), 'utf8'));
const userTemplate = compile(readFileSync(join(__dirname, 'user.html.hbs'), 'utf8'));

interface ReplayTemplateParameters {
  rootUrl: string;
  id: string;
  p1Id: string;
  p2Id: string;
  p1Name: string;
  p2Name: string;
  format: string;
  battleLog: string; // ?
};

const renderReplayTemplate = (parameters: ReplayTemplateParameters) => {
  return replayTemplate(parameters);
};

const renderUserTemplate = (content: string) => {
  return userTemplate({ content });
};

export {
  renderReplayTemplate,
  renderUserTemplate,
};