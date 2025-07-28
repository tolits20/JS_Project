const express = require("express");
const route = express.Router();
const { auth, role } = require("../middleware");
const admin = require("../controller/admin");
const {sendEmail} = require("../util/nodemailer")

const upload = require("../middleware/multer");

route.get("/admin/user",auth,role('admin'), admin.getAll);
route.get("/admin/user/:id",auth,role('admin'), admin.getById);
route.post("/admin/user/:id",auth,role('admin'), upload.single("img"), admin.update);
route.delete("/admin/user/:id",auth,role('admin'), admin.delete);

route.post("/admin/status/:id",auth,role('admin'), admin.status);
route.delete('/admin/user/softDelete/:id',auth,role('admin'),admin.softDelete)

//for plugins resources
route.get("/admin/user-all",auth,role('admin'), admin.userTable);
// route.get("/sendEmail", async (req, res) => {
//   try {
//     await sendEmail();
//     res.status(200).json({ message: "Email sent with PDF!" });
//   } catch (err) {
//     console.error(" Failed to send email:", err);
//     res.status(500).json({ error: "Failed to send email." });
//   }
// });

module.exports = route;
