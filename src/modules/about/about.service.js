const AboutModel = require("./about.model");

class AboutService {
  transformRequest = (req, isEdit = false) => {
    let { skill } = req.body;
    // let skill ='[{"title":"title1"}]'
    console.log(typeof skill);
    let skills = JSON.parse(skill);
    console.log([skills]);
    const data = {
      ...req.body, // title, status, url, image, createdBy
      skill: skills,
    };
    console.log(req.files, "from controller");

    if (!isEdit && !req.files) {
      throw {
        code: 422,
        message: "Image is requires",
        result: { image: "Image is required" },
      };
    } else {
      if (req.files) {
        data.image = req.files[0].filename;
      }
    }

    if (!isEdit) {
      data.createdBy = req.authUser._id;
    } else {
      data.updatedBy = req.authUser._id;
    }
    return data;
  };

  createdAbout = async (data) => {
    try {
      const about = new AboutModel(data);
      return await about.save(); //store
    } catch (exception) {
      throw exception;
    }
  };

  updateAbout = async (id, data) => {
    try {
      let status = await AboutModel.findByIdAndUpdate(id, { $set: data });
      return status;
    } catch (exception) {
      throw exception;
    }
  };

  getCount = async (filter = {}) => {
    const count = await AboutModel.countDocuments(filter);
    return count;
  };
  getOneByFilter = async (filter) => {
    try {
      //object if find or null
      const data = await AboutModel.findOne(filter)
        .populate("createdBy", ["_id", "name", "role"])
        .populate("updatedBy", ["_id", "name", "role"]);

      return data;
    } catch (exception) {
      throw exception;
    }
  };

  getAllAbouts = async ({ limit = 10, skip = 0, filter = {} }) => {
    try {
      let data = await AboutModel.find(filter)
        .populate("createdBy", ["_id", "name", "role"])
        .populate("updatedBy", ["_id", "name", "role"])
        .sort({ _id: "desc" })
        .skip(skip)
        .limit(limit);
      return data;
    } catch (exception) {
      throw exception;
    }
  };

  deleteById = async (id) => {
    try {
      let response = await AboutModel.findByIdAndDelete(id);
      if (!response) {
        throw {
          code: 404,
          message: "About does not exist or already deleted.",
        };
      } else {
        return response;
      }
    } catch (exception) {
      throw exception;
    }
  };
}

const aboutSvc = new AboutService();
module.exports = aboutSvc;
