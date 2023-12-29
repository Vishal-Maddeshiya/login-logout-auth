import { Router } from "express";
const router = Router();

import * as controller from "../controllers/appController.js";
import { registerMail } from "../controllers/mailer.js";
import Auth, { localVariables } from "../middleware/auth.js";

/**Post Methods */
router.route("/register").post(controller.register);
router.route("/registerMail").post(registerMail);
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end());
router.route("/login").post(controller.verifyUser, controller.login);

/**Get Methods */
router.route("/user/:username").get(controller.getUser);
router
  .route("/genrateOtp")
  .get(controller.verifyUser, localVariables, controller.genrateOtp);
router.route("/verifyOtp").get(controller.verifyUser, controller.verifyOtp);
router.route("/createResetSession").get(controller.createResetSession);

/**Put Methods */
router.route("/updateuser").put(Auth, controller.updateUser);
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword);

export default router;
