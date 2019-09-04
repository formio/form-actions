import { Express, Request, Response } from 'express';
import { Config } from './config';
import { Action } from './actions/Action';
import actions from './actions';

export class ActionsServer {
  private router: Express;
  private config: Config;
  private actions: any;

  constructor(app: Express, config: Config) {
    // Ensure that required environment variables are set.
    if (this.requiredEnvVars.reduce((prev, variable) => {
      const missing = !process.env[variable];
      if (missing) {
        console.error('Missing Environment Variable', variable);
      }
      return prev || missing;
    }, false)) {
      process.exit(1);
    }

    this.actions = {};
    for (const name in actions) {
      const action = new actions[name](this.config);
      this.actions[name] = action;
    }


    this.router = app;
    this.router.use(this.authenticate.bind(this));
    this.router.get('/', this.root.bind(this));

    this.router.get('/actions', this.actionsIndex.bind(this));
    // Add action specific endpoints.
    for (const name in this.actions) {
      const action = this.actions[name];

      // If action has a defined url, assume it already is listening somewhere.
      if (!action.url) {
        this.actions[name] = new actions[name](this.config);
        this.router[action.method.toLowerCase()](`/actions/${name}`, this.resolve.bind(null, this.actions[name]));
      }
    }

    this.config = config;
  }

  get requiredEnvVars() {
    return [
      'AUTH_KEY',
    ];
  }

  authenticate(req, res, next) {
    if (
      req.headers.hasOwnProperty('authorization') &&
      req.headers.authorization === `Bearer: ${this.config.key}`
    ) {
      return next();
    }
    return res.status(401).send('Unauthorized');
  }

  get actionsList(): any {
    const actionInfo: any = {};

    for (const name in this.actions) {
      const action = this.actions[name];
      actionInfo[name] = {
        info: action.info(),
        settingsForm: action.settingsForm(),
        method: action.method,
      };

      // If the action provides a different url, set it here.
      if (action.url) {
        actionInfo[name].url = action.url;
      }
    }

    return actionInfo;
  }

  root(req, res) {
    res.send({
      actions: this.actionsList,
    })
  }

  actionsIndex(req, res) {
    res.send(this.actionsList);
  }

  async resolve(action: Action, req: Request, res: Response) {
    try {
      const result = await action.resolve(req.body);
      res.status(200).send(result);
    }
    catch (err) {
      res.status(400).send(err);
    }
  }
}
