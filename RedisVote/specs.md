Questions
	Reponses
Question Courante
	Vote Pour la question courant
On graphes les réponses de la question courante

question
keys question:*!
hset question:id! response
set question:id:title title
set question:id:title label
set currentquestion question:questioid
hincr question:questioid response
incr maxquestionid

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