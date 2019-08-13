import Action from './Action';

export default class Example1 extends Action {
  /**
   * Info returns the information about the action such as its name, running information and default settings. This
   * informs the action lists about what information to show about the action so it can be added to a form.
   *
   * @returns actionInfo
   */
  static info() {
    return {
      name: 'example',
      title: 'Example',
      description: 'An example action.',
      group: 'default', // To be used for action grouping on the actions page.
      priority: 10, // Order the actions. The lower the number, the earlier it is run.
      default: true, // If default, it will be automatically added to any new forms.
      defaults: { // Defaults for the action settings. You can include other default settings as well.
        handler: ['before'],
        method: ['create'],
        exampleSetting: 'Setting Default',
      },
      access: { // Whether to allow modifying the handler and method settings in action configuration.
        handler: true,
        method: true
      }
    };
  }

  /**
   * This returns the setting form used to configure the action when it is added to a form. You need to pass an array
   * of form.io components to the super.settingsForm to fully create the form. Settings can then be used in resolve to
   * change the behavior of the action.
   *
   * 'options' contains roles, components and baseUrl that can be used to configure the settingsForm.
   *
   * @param options
   * @returns {*}
   */
  static settingsForm() {
    return [
      {
        type: 'textfield',
        key: 'exampleSetting',
        input: true,
        label: 'Example Setting',
        description: 'An example setting field that a user can configure when adding an action to a form.',
      }
    ];
  }

  /**
   * The main function that executes the action. You can access the settings with this.settings.
   */
  resolve() {
    return Promise.resolve();
  }
};
