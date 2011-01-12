var CurrentQuestion = 0;

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

    $(document).ready(function() {
        $("#submit").click(function(event) {
            RedisCommand ($('[name=command]').val(),"#results","")
            event.preventDefault();
        });
        
        $('input[name="toto"]').live('click',function(event) {
            console.log("hincrby/question_{0}/{1}/1".format(JSON.parse(CurrentQuestion),$(this).val()));
            RedisCommand ("hincrby/question_{0}/{1}/1".format(JSON.parse(CurrentQuestion),$(this).val()), nil, "#graph");
        });
    });
function nil(){}

function RedisCommand (command, callback, target, template ){

    $.ajax({
        url: "../public/redis/" + command,
        cache: false,
        success: function(data){
            callback (target, template, data);
        },
        error: function (request, status, error) {
            $("#errors").append("<pre>"+request.responseText+'</pre>');
        },
    });    
    
}

function updateHTML (target, template, data){
    $(target).html(render(template,data));
    updateGraph("#graph", '<div  style ="width:{1}0px;background-color:green;">{0}</div>', data);
}

function updateGraph(target,template,data){

    $(target).html(render(template,data));
}


function render(template,args){

    var response="";
    if (args!="null"){
        if ((typeof args) == "integer"){
            return args;
            }
        myargs=JSON.parse(args);
        if ((typeof myargs) == "string"){
            return myargs+"<hr>";
            }
        if ((typeof myargs) == "object"){
            $.each(myargs, function(k,v){
              response+= template.format(k,v);
            });
            return response;
        }
    }
    return response;
}



function updateCurrentQuestion(id){
    CurrentQuestion=(id);
    RedisCommand ('hgetall/question_' + eval(CurrentQuestion) ,updateHTML, "#vote",'<input type ="radio" name="toto" value ={0}>{0} ({1})<br>');
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
    updateCurrentQuestion(CurrentQuestion);
}

setInterval ("probeCurrentQuestion()", 500);

var placeholder = $("#graph");


function mockQuestions (){
      RedisCommand("set/currentquestion/1");
      RedisCommand("set/question_1_title/title");
      RedisCommand("set/question_1_label/label");
      RedisCommand("hset/question_1/response1/0");
      RedisCommand("hset/question_1/response2/0");
      RedisCommand("hset/question_1/response3/0");
      RedisCommand("set/question_2_title/title 2");
      RedisCommand("set/question_2_label/label 2");
      RedisCommand("hset/question_2/response2_1/0");
      RedisCommand("hset/question_2/response2_2/0");
      RedisCommand("hset/question_2/response2_3/0");
}