/**
 * Copyright (c) 2011 AF83
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * Redis HTTP Proxy
 *
 * @package RedisHttp
 * @author Ori Pekelman
 */

var connect = require('connect')
    , sys = require("sys")
    , redis = require("redis").createClient()
    , connect = require('connect')
    , connect_form = require('connect-form')
    , sessions = require('cookie-sessions')
    , web = require ('nodetk/web')
    , oauth2_client = require('oauth2-client')
    , url = require('url')
  
    , valid_auth = require('./valid_auth')
    , config = require('./config')
    ;



function main(app) {

    app.get(/\/redis\/(\w+)\/(.*)\/?/i, function (req, res, next) {
        var command = req.params[0];
        var params=url.parse(req.url, true).query;        
        console.log(req.session);
        var args;
        if (!req.params[1].length) {
            args = [];
        } else {
            args = req.params[1].split("/");
        }
        try {
            redis[command](args, function (err, reply) {
            var   contentType = {'Content-Type': 'application/json'};
                if (err) {
                    res.writeHead(400, contentType );
                    console.log (JSON.stringify(err));
                    res.end(JSON.stringify(err));
                } else {

                    if (reply != null) {
                        resp = JSON.stringify(reply);

                    } else {
                        resp="";
                    }
                    if (params.callback != undefined) 
                    {    
                        resp = params.callback +'('+ resp +')';
                        contentType = {'Content-Type': 'application/javascript'};
                    }
                    res.writeHead(200, contentType);
                    res.end(resp);
                }
            });
        } catch (err) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            });
            console.log (JSON.stringify(err));
            res.end(JSON.stringify(err));
        }
    });
}


var oauth2_client_options = {
  auth_server: {
    // To get info from access_token and set them in session
    treat_access_token: function(data, req, res, callback, fallback) {
      var params = {oauth_token: data.token.access_token,
                    authority: config.oauth2_client.authority,
                    domain: config.oauth2_client.domain};
      web.GET(config.oauth2_client.portable_contacts_url, params,
              function(status_code, headers, body) {
                if(status_code != 200){
                 console.log("Bad answer from AuthServer: "+status_code+" "+body);
                  return fallback("Bad answer from AuthServer: "+status_code+" "+body);
                }
                var info = JSON.parse(body);
                req.session.userid = info.entry;
                console.log ( info.entry);
                callback();
              });
    }
  }
};

var client = oauth2_client.createClient(config.oauth2_client, oauth2_client_options);

var server = connect.createServer(
      sessions(config.session)
    , client.connector()
    , valid_auth.connector(client)
    , connect.static(__dirname + "/../../../examples/")
    , connect.router(main)
    
);

server.listen(config.server.port);
console.log('Connect server listening on port ' + config.server.port);