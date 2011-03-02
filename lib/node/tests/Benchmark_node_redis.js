var sys = require("sys");
var redis = require("redis").createClient();
var util = require('util');
redis.debugMode = false;   
console.log(util.inspect(process.memoryUsage()));

fast_iterations = process.argv[2] ||5000;
slow_iterations = process.argv[3] ||2500;
repeat = process.argv[4] || 3;
verbose = process.argv[5] || false;

callbacks=0;

start_time = new Date().getTime();
if (verbose)    sys.print("\n--- Benchmark for redis-node-client ---\n");

for (var j = 1; j < repeat; j++) {
    callbacks = callbacks + 2;
    redis.select(2, function (err){measure()});
    redis.flushdb( function (err){measure()});
    for (var i = 0; i < fast_iterations; i++) {
      (function (i) {
              callbacks = callbacks + 6;
              redis.set(i, 'bar' +i, function (err){measure()});
              redis.set("foo", 'bar', function (err){measure()});
              redis.get('baz', function (err){measure()}) ;
              redis.get('foo', function (err){measure()}) ;
              redis.del('foo', function (err){measure()});
              redis.mget([1, 'foo'], function (err){measure()});
      })(i);
    }
    ++callbacks;
    redis.flushdb(function (err){measure()});
    for(var i = 0; i < slow_iterations; i++){
        callbacks = callbacks +3;
        redis.set(i, 'bar' + i, function (err){measure()});
        redis.keys('*', function (err){measure()});
        redis.randomkey(function (err){measure()});
    }
    }
    
injection_ended_time = new Date().getTime();

function measure(){
--callbacks;
if (verbose && !(callbacks % 100)) sys.print (".") ;
if (callbacks<=0){    
    end_time = new Date().getTime();
    if (verbose) sys.print ("\nTests completed in " +  ( (end_time - start_time )/1000) /repeat+ " seconds in average\n");
    if (verbose) sys.print ("\nTests after injection completed in " +   ((end_time - injection_ended_time )/1000) /repeat+ " seconds in average\n");
    console.log(util.inspect(process.memoryUsage()));
    process.exit(1);
    
    }
}