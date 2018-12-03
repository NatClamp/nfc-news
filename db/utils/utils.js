const moment = require('moment');

exports.userLookup = (users) => {
  const userLookup = {};
  users.forEach((user) => {
    userLookup[user.username] = user.user_id;
  });
  return userLookup;
};

exports.formatArticles = (data, userLookup) => {
  const formattedArticles = data.map((article) => {
    const date = moment(data.created_at).format('DD-MM-YYYY hh:mm:ss');
    article.created_at = date;
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

exports.formatComments = (data, articleLookup) => {
  const formattedComments = data.map((comment) => {
    const date = moment(data.created_at).format('DD-MM-YYYY hh:mm:ss');
    comment.created_at = date;
    comment.belongs_to = articleLookup[comment.belongs_to];
    return comment;
  });
  return formattedComments;
};
