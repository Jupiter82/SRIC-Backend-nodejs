const logoSvc = require("./logo.service");

class LogoController {
  createLogo = async (req, res, next) => {
    try {
      const data = logoSvc.transformRequest(req);
      const success = await logoSvc.createdLogo(data);
      res.json({
        result: success,
        message: "Logo stored successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("LogoCreate", exception);
      next(exception);
    }
  };
  listAllLogos = async (req, res, next) => {
    try {
      // /Logo?limit=10&page=2&search=Logo
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
      const count = await logoSvc.getCount(filter);
      const data = await logoSvc.getAllLogos({
        limit: limit,
        skip: skip,
        filter: filter,
      });
      res.json({
        result: data,
        message: "Logo Fetched",
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
  getLogoDetail = async (req, res, next) => {
    try {
      const data = await logoSvc.getOneByFilter({ _id: req.params.id });
      if (!data) {
        throw { code: 404, message: "Logo does not exists" };
      } else {
        res.json({
          result: data,
          message: "Logo Fetched",
          meta: null,
        });
      }
    } catch (exception) {
      next(exception);
    }
  };
  updateById = async (req, res, next) => {
    try {
      const logoDetail = await logoSvc.getOneByFilter({ _id: req.params.id });
      if (!logoDetail) {
        throw { code: 404, message: "logo not found" };
      }
      const data = logoSvc.transformRequest(req, true);
      if (!data.image) {
        data.image = logoDetail.image;
      }

      const success = await logoSvc.updateLogo(req.params.id, data);
      if (!success) {
        throw { code: 400, message: "Problem while updating logo" };
      }
      res.json({
        result: success,
        message: "logo Updated successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("logoUpdate", exception);
      next(exception);
    }
  };
  deleteById = async (req, res, next) => {
    try {
      let response = await logoSvc.deleteById(req.params.id);
      if (!response) {
        throw { code: 400, message: "Problem while deleting logo" };
      } else {
        res.json({
          result: response,
          message: "logo Deleted successfully",
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
      const data = await logoSvc.getAllLogos({
        limit: 10,
        skip: 0,
        filter: {},
      });
      if (!data || data.length <= 0) {
        throw { code: 400, message: "Empty Logo list" };
      }
      res.json({
        result: data,
        message: "Logo Fetched",
        meta: null,
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };
}

const logoCtrl = new LogoController();
module.exports = logoCtrl;
