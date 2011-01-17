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
var connect = require('connect');
var sys = require("sys");
var redis = require("redis").createClient();

function main(app) {

    app.get(/\/redis\/(\w+)\/(.*)\/?/i, function (req, res, next) {
        command = req.params[0];
        var args;
        if (!req.params[1].length) {
            args = new Array();
        } else {
            args = req.params[1].split("/");
        }
        try {
            redis[command](args, function (err, reply) {
                if (err) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });
                    console.log (JSON.stringify(err));
                    res.end(JSON.stringify(err));
                } else {
                    if (reply != null) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        res.end(JSON.stringify(reply));
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        console.log ("Got Null response");
                        res.end("");
                    }
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

var server = connect.createServer(
connect.router(main),
connect.staticProvider(__dirname + "/../RedisVote/")
);

server.listen(3000);
console.log('Connect server listening on port 3000');