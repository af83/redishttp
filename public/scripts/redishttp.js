(function($) {
    // RedisHTTP jquery Plugin ... not implemented yet
    $.fn.redisHTTP = function(options) {
        var opts = $.extend({}, $.fn.redisHTTP.defaults, options);

        return this.each(function() {
            var $this = $(this);

            // Support for the Metadata Plugin.
            var o = $.meta ? $.extend({}, opts, $this.data()) : opts;


        });

        // private function for debugging
        function debug($obj) {
            if (window.console && window.console.log) {
                window.console.log($obj);
            }
        }
    };

    // default options
    $.fn.redisHTTP.defaults = {
        root:"./redis/",
        dataType: "application/json",
    };

    })(jQuery);


    $(document).ready(function() {
        $("#submit").click(function(event) {
            event.preventDefault();
            $.ajax({
                url: "./redis/" + $('[name=command]').val(),
                cache: false,
                success: function(html){
                    $("#results").append("<pre>"+html+'</pre>');
                },
                error: function (request, status, error) {
                    $("#errors").append("<pre>"+request.responseText+'</pre>');
                },
            });
        });    
    });

    $(document).ready(function() {
        $("#gethelp").click(function(event) {
            event.preventDefault();
            $.ajax({
                url: "./redis/rediscommands.php" + $('[name=command]').val(),
                cache: false,
                success: function(html){
                    $("#help").html(html);
                },
                error: function (request, status, error) {
                    $("#help").append("<pre>"+request.responseText+'</pre>');
                },
            });
        });    
    });
