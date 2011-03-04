var config = require('./config')
;

exports.connector = function(client) {
  return function(req, res, next) {
    if((!req.session || !req.session.userid) && config.oauth2_client.enabled) {
      return client.redirects_for_login(config.oauth2_client.default_server, res, req.url);
    }
    else next();
  };
};
