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
 * Redis HTTP Proxy Javascript
 *
 * @package RedisHttp
 * @author Ori Pekelman
 */
/** 
* Send Redis Command to server 
*
**/
function RedisCommand(command, callback, err) {
    $.ajax({
        url: RedisBase + command,
        cache: false,
        success: callback,
        error: err,
    });
}

;(function($) {
/**
 * jQuery Redis HTTP Client
 *
 * Usage $("#mydiv").redisHTTP("keys/*");
 * advanced: $("#redisvote").redisHTTP("keys/*", {template:"{0}, {1}", callback:MyCallBack, MyErrorCallBack });
 *
 * if no template is passed : will consider the html inside the element to be the template
 */ 
$.redisHTTP = function(command, options) {
    var obj = {
            template:  options.template,
          };
    RedisCommand(command, $.proxy(options.callback,obj), options.error_callback);
};

/**
 * a small helper function implementing positional templating
 *
*/
$.redisHTTP.format = function  (string) {
    var formatted = string;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i+1]);
    }
    return formatted;
};

/**
 * a very minimal templating function
 *
 */
$.redisHTTP.render = function (template, args) {
    var response = "";
    if (args != "null" ) {
        if ((typeof args) == "integer") {
            return args;
        }
        if ((typeof args) == "string") {
            return args;
        }
        if ((typeof args) == "object") {
            $.each(args, function (k, v) {
                response += $.redisHTTP.format(template,k, v);
            });
            return response;
        }
    }
    return response;
}

/**
 * a very minimal Dom update function
 *
 */
$.redisHTTP.updateHTML = function (data) {
    $(this.target).html($.redisHTTP.render(this.template, data));
}

$.redisHTTP.Error = function (request, status, error) {
    $("#redis_console_errors").append("<pre>" + request.responseText + '</pre>');
}

/**
 * Call Redis Server and update dom element with response
 *
 */
$.fn.redisHTTP = function(command, options) {

  var opts = $.extend({}, $.fn.redisHTTP.defaults, options);

      return this.each(function() {

          var $this = $(this);
          // Support for the Metadata Plugin.
          var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
          if (o.template==undefined) template= $this.html().toString(); else template = o.template;
    
          var obj = {
              template:  template,
              target: $this
            };

            RedisCommand(command, $.proxy(o.callback,obj), o.error_callback);
  });
  }
  
  /**
   * Debugging console utility
   *
   */
  $.redisHTTP.console = function (){
      redisconsole='<div id="redis_console" style="color: #f0c;font-size: 9px;      font-family: Verdana, Geneva, Arial, sans-serif;      background-color: #whiteSmoke;  padding: 20px;   position: absolute;      bottom: 0px;      left: 0px;      width: 100%;height: 10%px"><form><input name ="redis_console_submit" id="redis_console_submit" type ="submit" value="Send Redis command" /><input name ="redis_console_command" id="redis_console_command" /></form><div id="redis_console_results" style="color:green"></div><div id="redis_console_errors" class="warning"></div></div';
      $(redisconsole).appendTo(document.body);
      $("#redis_console_submit").click(function (event) {
          var obj = {
                  template:'<pre>{0} {1}</pre>',
                  target: "#redis_console_results"
                };
          RedisCommand($('[name=redis_console_command]').val(), $.proxy($.redisHTTP.updateHTML,obj), $.redisHTTP.Error);
          event.preventDefault();
      });

  }

  // default options

  $.fn.redisHTTP.defaults = {
    callback: $.redisHTTP.updateHTML,
    error_callback: $.redisHTTP.Error
    };

  $.redisHTTP.defaults = {
      template:"{0}{1}",
  };

  $.extend($.redisHTTP.defaults, $.fn.redisHTTP.defaults );

})(jQuery);
