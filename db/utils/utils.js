exports.userLookup = (users) => {
  // should refactor this to use reduce
  const userLookup = {};
  users.forEach((user) => {
    userLookup[user.username] = user.user_id;
  });
  return userLookup;
};

exports.formatArticles = (data, userLookup) => {
  const formattedArticles = data.map((article) => {
    const cloneArticle = { ...article };
    cloneArticle.created_at = new Date(article.created_at);
    cloneArticle.created_by = userLookup[article.created_by];
    const {
      title, topic, created_by, body, created_at, votes,
    } = cloneArticle;
    return {
      title, topic, created_by, body, created_at, votes,
    };
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
    const cloneComment = { ...comment };
    cloneComment.created_at = new Date(comment.created_at);
    cloneComment.article_id = articleLookup[comment.belongs_to];
    cloneComment.user_id = userLookup[comment.created_by];
    const {
      body, votes, user_id, created_at, article_id,
    } = cloneComment;
    return {
      body, votes, user_id, created_at, article_id,
    };
  });
  return formattedComments;
};
