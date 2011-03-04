var CurrentQuestion = 0;
var voted = false;
var RedisBase = "../public/redis/";
//var RedisBase = "http://localhost:3000/redis/";
var commands={
                vote: "hincrby/question_{0}/{1}/1",
                getResponses: "hgetall/question_{0}",
                questionTitle:"get/question_{0}_title"
            }

$(document).ready(function () {
    $('input[name="resp"]').live('click', function (event) {
        var command = $.redisHTTP.format(commands.vote, CurrentQuestion, $(this).val());
        //if (!voted) 
        RedisCommand(command); voted = true;
    });
});


function updateQuestion(data) {
        CurrentQuestion=data;
        var command = $.redisHTTP.format(commands.questionTitle, CurrentQuestion);

        $("#question_label").redisHTTP(command);
        var command =  $.redisHTTP.format(commands.getResponses, CurrentQuestion);
        $("#vote").redisHTTP(command , 
            {
            template: '<input type ="radio" name="resp" value ={0} >{0} ({1})<br>', 
            callback: updateGraph,
        });
    }
    
function probeCurrentQuestion()    {
    $.redisHTTP("get/currentquestion", {callback:updateQuestion});
}

function updateGraph(data) {
    $(this.target).html($.redisHTTP.render(this.template, data));
    var rows = "";
    if (data != "null") {
        $.each(data, function (k, v) {
            rows += "<tr><td>" + k + "</td><td>" + v + "</td></tr>";
        });
        table = "<table><thead><tr><th>Question</th><th>Score</th></tr></thead>" + rows + "<table>";
        $("#graph").html(table).charts;
        $("#graph").charts();
    }
}

//setInterval("probeCurrentQuestion()", 500);