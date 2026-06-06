const roles = {
  user: 'user',
  guid: 'guid',
  leadGuide: 'lead-guide',
  admin: 'admin',
};
const NODE_ENV = {
  dev: process.env.ENV_DEV,
  prod: process.env.ENV_PROD,
};
const BASEURL = '/api/v1';

module.exports = {
  roles,
  BASEURL,
  NODE_ENV,
};
