import { Express } from 'express';
import { Config } from './config';
import actions from './actions';

export class FormActions {
  private app: Express;
  private config: any;

  constructor(app: Express, config: Config) {
    this.app = app;
    this.app.get('/', this.root.bind(this));

    this.app.get('/actions', this.actionsIndex.bind(this));

    this.config = config;
  }

  get actions() {
    const actionInfo = {};

    for (const name in actions) {
      actionInfo[name] = {
        info: actions[name].info(),
        settingsForm: actions[name].settingsForm(),
        method: actions[name].method,
      };

      // If the action provides a different url, set it here.
      if (actions[name].url) {
        actionInfo[name].url = actions[name].url;
      }
    }

    return actionInfo;
  }

  root(req, res) {
    res.send({
      actions: this.actions,
    })
  }

  actionsIndex(req, res) {
    res.send(this.actions);
  }
}
