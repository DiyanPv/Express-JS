exports.get404 = (req, res, next) => {
  res.status(408).render("404", {
    pageTitle: "Page Not Found",
    path: `/`,
  
  });
};
