const serviceSvc = require("./service.service");

class ServiceController {
  createService = async (req, res, next) => {
    try {
      const data = serviceSvc.transformRequest(req);
      const success = await serviceSvc.createdService(data);
      res.json({
        result: success,
        message: "Service stored successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("ServiceCreate", exception);
      next(exception);
    }
  };
  listAllServices = async (req, res, next) => {
    try {
      // /Service?limit=10&page=2&search=Service
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
      const count = await serviceSvc.getCount(filter);
      const data = await serviceSvc.getAllServices({
        limit: limit,
        skip: skip,
        filter: filter,
      });
      res.json({
        result: data,
        message: "Service Fetched",
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
  getServiceDetail = async (req, res, next) => {
    try {
      const data = await serviceSvc.getOneByFilter({ _id: req.params.id });
      if (!data) {
        throw { code: 404, message: "service does not exists" };
      } else {
        res.json({
          result: data,
          message: "service Fetched",
          meta: null,
        });
      }
    } catch (exception) {
      next(exception);
    }
  };
  updateById = async (req, res, next) => {
    try {
      const serviceDetail = await serviceSvc.getOneByFilter({
        _id: req.params.id,
      });
      if (!serviceDetail) {
        throw { code: 404, message: "service not found" };
      }
      const data = serviceSvc.transformRequest(req, true);
      if (!data.image) {
        data.image = serviceDetail.image;
      }

      const success = await serviceSvc.updateService(req.params.id, data);
      if (!success) {
        throw { code: 400, message: "Problem while updating Service" };
      }
      res.json({
        result: success,
        message: "Service Updated successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("ServiceUpdate", exception);
      next(exception);
    }
  };
  deleteById = async (req, res, next) => {
    try {
      let response = await serviceSvc.deleteById(req.params.id);
      if (!response) {
        throw { code: 400, message: "Problem while deleting service" };
      } else {
        res.json({
          result: response,
          message: "service Deleted successfully",
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
      const data = await serviceSvc.getAllServices({
        limit: 10,
        skip: 0,
        filter: {
          status: "active",
        },
      });
      if (!data || data.length <= 0) {
        throw { code: 400, message: "Empty Service list" };
      }
      res.json({
        result: data,
        message: "Service Fetched",
        meta: null,
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };
}

const serviceCtrl = new ServiceController();
module.exports = serviceCtrl;
