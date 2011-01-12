    $(document).ready(function() {
        $("#submit").click(function(event) {
            RedisCommand ($('[name=command]').val(),"#results","")
            event.preventDefault();
        });    
    });

function RedisCommand (command, target, template){
    
    $.ajax({
        url: "../public/redis/" + command,
        cache: false,
        success: function(data){
            $(target).append(render(template,data));
        },
        error: function (request, status, error) {
            $("#errors").append("<pre>"+request.responseText+'</pre>');
        },
    });    
    
}

function render(template,args){
    return args;
    return $.nano(template, args);
}

var CurrentQuestion;
function updateCurrentQuestion(id){
    CurrentQuestion=(id);
    RedisCommand ('hgetall/question:' + eval(CurrentQuestion) , "#vote","");
}

function probeCurrentQuestion (){
    $.ajax({
        url: "../public/redis/" + "get/currentquestion",
        cache: false,
        success: function(data){
            if (CurrentQuestion!=(data)) {
                updateCurrentQuestion(data);
            };
        }
    });
    
}

setInterval ("probeCurrentQuestion()", 500);

RedisCommand ('get/question:id:title', "#questionlabel","The question:{label}");
RedisCommand ('hgetall/question:id', "#vote","");



//questionstemplate ='<input name="' +id  + '" value ="' +value +'">';
/*
incr/maxquestionid
get/maxquestionid
set/question:id:title/title 
set/question:id:title/label

get/question:id:title

set/currentquestion/question:id
get/currentquestion
hset/question:id/response1/0
hset/question:id/response2/0
hset/question:id/response3/0

hincrby/question:id/response3/1

hgetall/question:id

*/