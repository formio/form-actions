export default class Action {
  private settings: any;

  /**
   * Info returns the information about the action such as its name, running information and default settings. This
   * informs the action lists about what information to show about the action so it can be added to a form.
   *
   * @returns actionInfo
   */
  static info() {
    return {};
  }

  /**
   * This returns the setting form used to configure the action when it is added to a form. Settings can then be used in
   * resolve to change the behavior of the action.
   *
   * @returns [components]
   */
  static settingsForm() {
    return [];
  }

  /**
   * Type of request to make when calling this action.
   */
  static get method() {
    return 'POST';
  }

  /**
   * URL of the request. If this returns false it will use the default url for this server action.
   */
  static get url() {
    return false;
  }

  constructor(settings) {
    this.settings = settings;
  }

  /**
   * The main function that executes the action. You can access the settings with this.settings.
   */
  resolve() {
    return Promise.resolve();
  }
};
