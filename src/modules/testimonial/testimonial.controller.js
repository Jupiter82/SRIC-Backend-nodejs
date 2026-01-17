const testimonialSvc = require("./testimonial.service");

class TestimonialController {
  createTestimonial = async (req, res, next) => {
    try {
      const data = testimonialSvc.transformRequest(req);
      const success = await testimonialSvc.createdTestimonial(data);
      res.json({
        result: success,
        message: "testimonial stored successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("testimonialCreate", exception);
      next(exception);
    }
  };
  listAllTestimonials = async (req, res, next) => {
    try {
      // /Testimonial?limit=10&page=2&search=Testimonial
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
      const count = await testimonialSvc.getCount(filter);
      const data = await testimonialSvc.getAllTestimonials({
        limit: limit,
        skip: skip,
        filter: filter,
      });
      res.json({
        result: data,
        message: "Testimonial Fetched",
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
  getTestimonialDetail = async (req, res, next) => {
    try {
      const data = await testimonialSvc.getOneByFilter({ _id: req.params.id });
      if (!data) {
        throw { code: 404, message: "testimonial does not exists" };
      } else {
        res.json({
          result: data,
          message: "testimonial Fetched",
          meta: null,
        });
      }
    } catch (exception) {
      next(exception);
    }
  };
  updateById = async (req, res, next) => {
    try {
      const testimonialDetail = await testimonialSvc.getOneByFilter({
        _id: req.params.id,
      });
      if (!testimonialDetail) {
        throw { code: 404, message: "testimonial not found" };
      }
      const data = testimonialSvc.transformRequest(req, true);
      if (!data.image) {
        data.image = testimonialDetail.image;
      }

      const success = await testimonialSvc.updateTestimonial(
        req.params.id,
        data
      );
      if (!success) {
        throw { code: 400, message: "Problem while updating Testimonial" };
      }
      res.json({
        result: success,
        message: "Testimonial Updated successfully",
        meta: null,
      });
    } catch (exception) {
      console.log("TestimonialUpdate", exception);
      next(exception);
    }
  };
  deleteById = async (req, res, next) => {
    try {
      let response = await testimonialSvc.deleteById(req.params.id);
      if (!response) {
        throw { code: 400, message: "Problem while deleting testimonial" };
      } else {
        res.json({
          result: response,
          message: "testimonial Deleted successfully",
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
      const data = await testimonialSvc.getAllTestimonials({
        limit: 10,
        skip: 0,
        filter: {
          status: "active",
        },
      });
      if (!data || data.length <= 0) {
        throw { code: 400, message: "Empty Testimonial list" };
      }
      res.json({
        result: data,
        message: "Testimonial Fetched",
        meta: null,
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };
}

const testimonialCtrl = new TestimonialController();
module.exports = testimonialCtrl;
