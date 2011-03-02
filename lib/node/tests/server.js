var connect = require('connect');
var sys = require("sys");
var redis = require("redis").createClient();
var util = require('util');

function main(app) {
    app.get(/\/redis\/(\w+)\/(.*)\/?/i, function(req, res, next){
	    res.writeHead(200, { 'Content-Type': 'text/plain' });
		command=req.params[0];
		var args;
		if (!req.params[1].length)  {
			args = new Array(); 
			} else {
			args = req.params[1].split("/");
			}
		redis[command](args, function (err, reply) {
			if (err)  {
				res.end(err.toString()); 
				} else {
					if (reply!=null) {
						res.end(reply.toString());
						} else
						{
						res.end();
						}
				}
		});
    });
}


var server = connect.createServer(
	connect.router(main)
	);
server.listen(3000);
console.log('Connect server listening on port 3000');