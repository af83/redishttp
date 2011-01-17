## RedisHTTP is just a fun simple PHP / nodejs script that exposes Redis over HTTP

It simply takes the url path and passes it to Redis, getting the response back either Raw or encode in Json. The rational behnid this is to get a "free" persistant key val store in javascript. see http://cplus.about.com/b/2010/11/07/openkeyval-an-online-datastore.htm

On the choice of redisent see http://dev.af83.com/redis/which-php-library-use-redis/2010/12/30

Using it is as simple as :
`
$redishttp= new RedisHTTP();
echo json_encode(RedisHTTP::run());
`
So simply visiting http://localhost/redis/set/Hello/world

Will Set the key "Hello" to the value "World"

Visiting http://localhost/redis/get/Hello

Will output:
`
World


Visiting http://localhost/redis/flushdb *will destory your redis data*. All of it. Without ever asking for any kind of confirmation.
So if ever you mean to use this, you *must* implement server side controls.

All of Redis methods are supported. So you can use for example
http://localhost/redis/info
to monitor your redis server

you can set the redis host and port with $redishttp= new RedisHTTP('localhost, 6379);

Note: there is no state on the server side. So each command you send is a new connection; This is mostly important so you understand: No piping, and select will basically do nothing

Below is a simple ajax form that sends commands to redis and shows the result seperate the commands and the parameters by a forward slash

examples (just type this in the input box below):

info
set/hello/world
get/hello

BSD licence (c) 2010 AF83 more on af83 dev blog http://dev.af83.com
