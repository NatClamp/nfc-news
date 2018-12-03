exports.userLookup = (users) => {
  const userLookup = {};
  users.forEach((user) => {
    userLookup[user.username] = user.user_id;
  });
  return userLookup;
};

exports.formatArticles = (data, userLookup) => {
  const formattedArticles = data.map((article) => {
    article.created_at = new Date(article.created_at);
    article.created_by = userLookup[article.created_by];
    return article;
  });
  return formattedArticles;
};

exports.articleLookup = (articles) => {
  const articleLookup = {};
  articles.forEach((article) => {
    articleLookup[article.title] = article.article_id;
  });
  return articleLookup;
};

exports.formatComments = (data, articleLookup, userLookup) => {
  const formattedComments = data.map((comment) => {
    comment.created_at = new Date(comment.created_at);
    comment.article_id = articleLookup[comment.belongs_to];
    comment.user_id = userLookup[comment.created_by];
    const {
      body, votes, user_id, created_at, article_id,
    } = comment;
    return {
      body, votes, user_id, created_at, article_id,
    };
  });
  return formattedComments;
};
