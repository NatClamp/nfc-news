exports.userLookup = users => users.reduce((accUserObj, currUser) => {
  accUserObj[currUser.username] = currUser.user_id;
  return accUserObj;
}, {});

exports.formatArticles = (data, userLookup) => {
  const formattedArticles = data.map(({ created_by, created_at, ...others }) => ({
    ...others,
    user_id: userLookup[created_by],
    created_at: new Date(created_at),
  }));
  return formattedArticles;
};

exports.articleLookup = articles => articles.reduce((accArticleObj, currArticle) => {
  accArticleObj[currArticle.title] = currArticle.article_id;
  return accArticleObj;
}, {});

exports.formatComments = (data, articleLookup, userLookup) => {
  const formattedComments = data.map(({
    created_at, created_by, belongs_to, ...others
  }) => ({
    ...others,
    user_id: userLookup[created_by],
    created_at: new Date(created_at),
    article_id: articleLookup[belongs_to],
  }));
  return formattedComments;
};
