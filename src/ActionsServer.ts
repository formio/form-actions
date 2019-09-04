import { Express } from 'express';
import { Config } from './config';
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
      if (!action.url) {
        console.log('registering', action.method, `/actions/${name}`);
        this.router[action.method.toLowerCase()](`/actions/${name}`, action.resolve.bind(action));
        this.actions[name] = new actions[name](this.config)
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
      req.headers.hasOwnProperty('authentication') &&
      req.headers.authentication === `Bearer: ${this.config.key}`
    ) {
      return next();
    }
    return res.status(401).send('Unauthorized');
  }

  get actionsList() {
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
}
