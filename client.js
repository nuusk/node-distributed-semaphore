const prompts = require('prompts');
const Client = require('./services/Client');

const client = new Client();

(async () => {
  await client.connect();

  const prompt = await prompts({
    type: 'number',
    name: 'value',
    message: '\nHow much resources do you need?',
    validate: (value) => (value > 5 ? 'You cannot take more than 5 at a time' : true),
  });

  const { value } = prompt;

  client.takeResource(value);
})();
