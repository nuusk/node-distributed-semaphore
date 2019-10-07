/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
const prompts = require('prompts');
const Client = require('./services/Client');

const client = new Client();

(async () => {
  await client.connect();

  while (true) {
    const actionSelection = await prompts({
      type: 'select',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        { title: 'Take resources', value: 'takeResources' },
        { title: 'Give resources', value: 'giveResources' },
        { title: 'Check resources', value: 'checkResources' },
      ],
    });

    const { action } = actionSelection;
    let quantity;

    switch (action) {
      case 'takeResources':
        quantity = await prompts({
          type: 'number',
          name: 'value',
          message: 'How much resources do you need?',
        });
        client.takeResources(quantity.value);
        break;
      case 'giveResources':
        quantity = await prompts({
          type: 'number',
          name: 'value',
          message: 'How much resources do you want to give back?',
        });
        client.giveResources(quantity.value);
        break;
      case 'checkResources':
        client.checkResources();
        break;
      default: break;
    }

    await prompts({
      type: 'invisible',
      name: 'value',
      message: 'Press enter to continue...',
    });
  }
})();
