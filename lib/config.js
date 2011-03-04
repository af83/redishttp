exports.server = {
  host: 'localhost',
  port: 3001,
  websocket_port: 3001
};

exports.session = {
  secret: "n0F5z60HmCGpHaznEJAROV5jNH1oXxBAI1XBfXaPMzv",
  session_key: "redishttp"
};



exports.oauth2_client = {
  enabled: true,

  client: {
    crypt_key: 'toto',
    sign_key: 'titi',
    base_url: 'http://localhost:3001',
    process_login_url: '/oauth2/process',
    redirect_uri: 'http://localhost:3001/oauth2/process',
    login_url: '/login',
    logout_url: '/logout',
    default_redirection_url: '/'
  },

  authority: 'localhost',
  domain: 'localhost:3001',

  portable_contacts_url: 'http://localhost:7070/portable_contacts/@me/@self',

  default_server: "auth_server",

  servers: {
    auth_server: {
      server_authorize_endpoint: 'http://localhost:7070/oauth2/authorize',
      server_token_endpoint: 'http://localhost:7070/oauth2/token',

      client_id: "4d6fcd1a9ad24b0000000007",
      client_secret: 'some secret string',
      name: 'redishttp'
    }
  }


};
