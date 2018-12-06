exports.getEndpointJSON = (req, res, next) => {
  const endpoints = {
    '/api': 'Serves JSON object describing the available endpoints on the API',
    '/api/topics': 'GET request responds with topic objects available & POST request allows you to post a topic object containing slug and description properties, and returns the posted topic',
    '/api/topics/:topic/articles': 'GET request responds with the articles for your chosen topic. You can query using "limit", "sort_by", "p" and "sort_ascending" & POST request allows you to post an article object containing title, body and user_id properties for your chosen topic',
    '/api/articles': 'GET request responds with all articles. You can query using "limit", "sort_by", "p" and "sort_ascending".',
    '/api/articles/:article_id': 'GET request responds with an article object for your chosen article_id & PATCH request allows you to upVote or downVote an article by your chosen amount by sending an object with inc_votes property & DELETE request allows you to delete the article using the article_id',
    '/api/articles/:article_id/comments': 'GET request responds with the comments for a chosen article_id & POST request allows you to post a comment object containing user_id and body properties to your chosen article',
    '/api/articles/:article_id/comments/:comment_id': 'PATCH request allows you to upVote or downVote a comment using an object with an inc_votes property & DELETE request allows you to delete the chosen comment',
    '/api/users': 'GET request responds with an array of all the users',
    '/api/users/:user_id': 'GET request reponds with an object containing data for the chosen user',
  };
  res.status(200).send({ endpoints });
};
