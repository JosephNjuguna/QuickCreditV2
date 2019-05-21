import user from './users';

const apiPrefix = '/api/v2';
const route = (app) => {
  app.use(apiPrefix, user);
};

export default route;
