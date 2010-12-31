<?php
/**
* Copyright (c) 2010 AF83
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

class RedisHTTP 
{
    protected static $redis;
    protected static $command;
    protected static $url_params;
    
    /**
     * RedisHTTP initialization
     *
     * @param string $host defaults to localhost
     * @param string $portdefaults to redis default port 6379
     * @author Ori Pekelman
     */
    function __construct($host="localhost", $port=6379)
    {
        try{
            RedisHTTP::$redis =new RedisentWrap($host,$port);
        }
        catch (Exception $e) {
            throw new RedisHTTP500Exception ("Could not create the Redis Object. The PHP extension is probaly not correctly installed (".$e->getMessage().")");
        }


        $root = rtrim(dirname($_SERVER['PHP_SELF']), '/');
        //Get the application-specific URI path
        if ( !empty($_SERVER['PATH_INFO']) ) {
            $uri = $_SERVER['PATH_INFO'];
        } else {
            if ( isset($_SERVER['REQUEST_URI']) ) {
                $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
                $uri = rawurldecode($uri);
                } else if ( isset($_SERVER['PHP_SELF']) ) {
                    $uri = $_SERVER['PHP_SELF'];
                } else {
                    return null;
                    //        throw new RuntimeException('Unable to detect request URI');
                }
            }

            if ( $root !== '' && strpos($uri, $root) === 0 ) {
                $uri = substr($uri, strlen($root));
            }

            $url_params=explode('/', $uri);

            $root=array_shift($url_params);
            self::$command=array_shift($url_params);

            if (isset($_POST['params'])){
                $url_params =  array_merge($url_params, $_POST['params']);
            }
            self::$url_params=$url_params ;
        }

    /**
    * Magic method to handle all function requests and prefix key based
    * operations with the 'resque:' key prefix.
    *
    * @param string $name The name of the method called.
    * @param array $args Array of supplied arguments to the method.
    * @return mixed Return value from Resident::call() based on the command.
    */
    public static function __callStatic($name, $url_params) {
        try {
            $redis=self::$redis;
              
           // if (!method_exists(self::$redis,$name)) throw new  RedisHTTP404Exception("Redis does not have a ' $name ' method ");  //  bool(true
    
                set_error_handler("catch_redis_warning", E_WARNING);
                $result = call_user_func_array(array(self::$redis, $name), $url_params);
                restore_error_handler();
                return $result;
            }
            catch(RedisHTTP404Exception $e) {
                return $e->getMessage();
            }
            catch (Exception $e) {
                return "Caught Exception ('{$e->getMessage()}')\n{$e}\n";
            }
        }
    
        static function run(){
              $redis=self::$redis;
             $response =   call_user_func_array(array($redis, self::$command), self::$url_params);
             return $response;
            $response = forward_static_call_array(array('RedisHTTP', self::$command), self::$url_params);
            $support_responses= Array ('text/plain', 'application/json');
            return $response;
        }
    }


class RedisHTTP404Exception extends Exception {
    function __construct($message, $code = 0, Exception $previous = null){
        // make sure everything is assigned properly
        parent::__construct($message, $code, $previous);
        header('HTTP/1.1 404 Not Found');
    }
}
class RedisHTTP500Exception extends Exception {
    function __construct($message, $code = 0, Exception $previous = null){
        // make sure everything is assigned properly
        parent::__construct($message, $code, $previous);
        header('HTTP/1.1 Internal Server Error');
    }
}
/**
 * catch_redis_warning transform redis warnings to catchable errors
 *
 * @param string $errno 
 * @param string $errstr 
 * @return void
 * @author Ori Pekelman
 */
function catch_redis_warning($errno, $errstr) {
    throw new RedisHTTP404Exception ($errstr, $errno); 

}
