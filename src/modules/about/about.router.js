const router = require("express").Router();
const { USER_ROLES } = require("../../config/constants.config");
const authCheck = require("../../middlewares/auth.middleware");
const PermissionCheck = require("../../middlewares/rbac.middleware");
const { validator } = require("../../middlewares/validator.middleware");
const aboutCtrl = require("./about.controller");
const { aboutCreateSchema } = require("./about.request");
const uploader = require("../../middlewares/uploader.middleware");

// router.post('/',authCheck, PermissionCheck('admin'), "control")

//about/view
router.get("/home", aboutCtrl.listForHome);

// about/post/dashboard
router
  .route("/")
  //upload-image
  .post(
    authCheck,
    PermissionCheck(USER_ROLES.superadmin),
    uploader.array("image"),
    validator(aboutCreateSchema),
    aboutCtrl.createAbout
  )

  .get(
    authCheck,
    PermissionCheck(USER_ROLES.superadmin),
    aboutCtrl.listAllAbouts
  );
router
  .route("/:id")
  .get(
    authCheck,
    PermissionCheck(USER_ROLES.superadmin),
    aboutCtrl.getAboutDetail
  )
  //upload
  .put(
    authCheck,
    PermissionCheck(USER_ROLES.superadmin),
    uploader.array("image"),
    validator(aboutCreateSchema),
    aboutCtrl.updateById
  )
  //delete
  .delete(
    authCheck,
    PermissionCheck(USER_ROLES.superadmin),
    aboutCtrl.deleteById
  );
module.exports = router;
