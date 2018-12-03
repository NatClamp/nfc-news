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

exports.formatComments = (data, articleLookup, userLookup) => {
  const formattedComments = data.map((comment) => {
    const date = moment(data.created_at).format('DD-MM-YYYY hh:mm:ss');
    comment.created_at = date;
    comment.article_id = articleLookup[comment.belongs_to];
    // get rid of delete, just make new object with stuff you want in
    // delete comment.belongs_to;
    comment.user_id = userLookup[comment.created_by];
    const {
      body, votes, user_id, created_at, article_id,
    } = comment;
    return {
      body, votes, user_id, created_at, article_id,
    };
  });
  console.log(formattedComments, '<======== LOOK AT ME');
  return formattedComments;
};
