const getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All tours ',
  });
};
const getTourview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
};

module.exports = {
  getOverview,
  getTourview,
};
