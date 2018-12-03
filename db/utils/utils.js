const {
  articleData,
} = require('../data/test-data');

exports.formattedArticles = () => {
  const date = new Date();
  const formattedArticleData = articleData.map((article) => {
    article.created_at = date;
    return article;
  });
  return formattedArticleData;
};
