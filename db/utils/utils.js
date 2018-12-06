exports.userLookup = users => users.reduce((accUserObj, currUser) => {
  accUserObj[currUser.username] = currUser.user_id;
  return accUserObj;
}, {});

exports.formatArticles = (data, userLookup) => {
  const formattedArticles = data.map((article) => {
    const cloneArticle = { ...article };
    cloneArticle.created_at = new Date(article.created_at);
    cloneArticle.user_id = userLookup[article.created_by];
    const {
      title, topic, user_id, body, created_at, votes,
    } = cloneArticle;
    return {
      title, topic, user_id, body, created_at, votes,
    };
  });
  return formattedArticles;
};

exports.articleLookup = articles => articles.reduce((accArticleObj, currArticle) => {
  accArticleObj[currArticle.title] = currArticle.article_id;
  return accArticleObj;
}, {});

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
