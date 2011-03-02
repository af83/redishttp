function mockQuestions() {
    RedisCommand("set/currentquestion/1");
    RedisCommand("set/question_1_title/Is Javascript ready for the enterprise?");
    RedisCommand("set/question_1_label/javascript ready");
    RedisCommand("hset/question_1/Yes/0");
    RedisCommand("hset/question_1/No/0");
    RedisCommand("hset/question_1/Maybe/0");
    RedisCommand("set/question_2_title/title2");
    RedisCommand("set/question_2_label/label2");
    RedisCommand("hset/question_2/response2_1/0");
    RedisCommand("hset/question_2/response2_2/0");
    RedisCommand("hset/question_2/response2_3/0");
}