const aboutSvc = require("./about.service");

class AboutController {
  createAbout = async (req, res, next) => {
    try {
      const data = aboutSvc.transformRequest(req);
      const success = await aboutSvc.createdAbout(data);
      res.json({
        result: success,
        message: "About stored successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("AboutCreate", exception);
      next(exception);
    }
  };
  listAllAbouts = async (req, res, next) => {
    try {
      // /About?limit=10&page=2&search=About
      const query = req.query;
      let limit = +query.limit || 10;
      let page = +query.page || 1;
      let skip = 0;

      if (page > 1) {
        skip = (page - 1) * limit;
      }
      let filter = {};
      if (query.search) {
        filter = {
          title: new RegExp(query.search, "i"),
        };
      }
      // skip = 0 , page 1
      //page = 2, skip = 10
      const count = await aboutSvc.getCount(filter);
      const data = await aboutSvc.getAllAbouts({
        limit: limit,
        skip: skip,
        filter: filter,
      });
      res.json({
        result: data,
        message: "About Fetched",
        meta: {
          currentPage: page,
          total: count,
          limit: limit,
        },
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };
  getAboutDetail = async (req, res, next) => {
    try {
      const data = await aboutSvc.getOneByFilter({ _id: req.params.id });
      if (!data) {
        throw { code: 404, message: "about does not exists" };
      } else {
        res.json({
          result: data,
          message: "about Fetched",
          meta: null,
        });
      }
    } catch (exception) {
      next(exception);
    }
  };
  updateById = async (req, res, next) => {
    try {
      const aboutDetail = await aboutSvc.getOneByFilter({ _id: req.params.id });
      if (!aboutDetail) {
        throw { code: 404, message: "about not found" };
      }
      const data = aboutSvc.transformRequest(req, true);
      if (!data.image) {
        data.image = aboutDetail.image;
      }

      const success = await aboutSvc.updateAbout(req.params.id, data);
      if (!success) {
        throw { code: 400, message: "Problem while updating About" };
      }
      res.json({
        result: success,
        message: "About Updated successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("AboutUpdate", exception);
      next(exception);
    }
  };
  deleteById = async (req, res, next) => {
    try {
      let response = await aboutSvc.deleteById(req.params.id);
      if (!response) {
        throw { code: 400, message: "Problem while deleting about" };
      } else {
        res.json({
          result: response,
          message: "about Deleted successfully",
          meta: null,
        });
      }
    } catch (exception) {
      console.log("deleteById", exception);
      next(exception);
    }
  };
  listForHome = async (req, res, next) => {
    try {
      const data = await aboutSvc.getAllAbouts({
        limit: 10,
        skip: 0,
      });
      if (!data || data.length <= 0) {
        throw { code: 400, message: "Empty About list" };
      }
      res.json({
        result: data,
        message: "About Fetched",
        meta: null,
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };
}

const aboutCtrl = new AboutController();
module.exports = aboutCtrl;
