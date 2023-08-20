const axios = from 'axios').default;
const dotenv = from 'dotenv');

dotenv.config({ path: '.env.local' });

export default = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  config.env.defaultPassword = process.env.SEED_DEFAULT_USER_PASSWORD;

  const testDataApiEndpoint = `${config.env.apiUrl}/testData`;

  on('task', {
    async 'db:seed'() {
      // seed database with test data
      const { data } = await axios.post(`${testDataApiEndpoint}/seed`);
      return data;
    },
    async 'db:getEntityData'(entity) {
      const data = await axios.get(`${testDataApiEndpoint}/${entity}`);
      return data;
    },
  });
};
