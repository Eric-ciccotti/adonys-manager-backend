const router = require("express").Router();

const UserController = require("../controller/User");

//apporte la fonction d'enregistrement d'un utilisateur
const {
  userAuth,
  serializeUser,
  checkRole,
} = require("../utils/Auth");

//Users Registration Route
router.post("/registrer-user", async (req, res) => {
  await UserController.userRegistration(req.body, "user", res);
});

//Admin Registration Route
router.post("/registrer-admin", async (req, res) => {
  await UserController.userRegistration(req.body, "admin", res);
});

//Login Route
router.post("/login", async (req, res) => {
  await UserController.userLogin(req.body, res);
});



//Get Role
router.get("/get-role", async (req, res) => {
  await UserController.getUserRole(req.body, res);
});

/*********************************************/

//Super Admin Registration Route
// router.post("/registrer-super-admin", async (req, res) => {
//   await userRegistration(req.body, "superadmin", res);
// });


//Super Admin Login Route
// router.post("/login-super-admin", async (req, res) => {
//   await userLogin(req.body, "superadmin", res);
// });

/*********************************************/

//Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

//Profile Route
router.get("/getRole", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

//Users Protected Route
router.get(
  "/user-protected",
  userAuth,
  checkRole(["user"]),
  async (req, res) => {
    return res.json("Hello User");
  }
);

//Admin Protected Route
router.get(
  "/admin-protected",
  userAuth,
  checkRole(["admin"]),
  async (req, res) => {
    const query = db.find({});
    return res.json("Hello admin");
  }
);

//Super Admin Protected Route
router.get(
  "/super-admin-protected",
  userAuth,
  checkRole(["superadmin"]),
  async (req, res) => {
    return res.json("Hello super admin");
  }
);

//Super Admin Protected Route
router.get(
  "/super-admin-and-admin-protected",
  userAuth,
  checkRole(["superadmin", "admin"]),
  async (req, res) => {
    return res.json(`Hello ${req.user.role}`);
  }
);

/************************** */

//Voir tout les profils de commerciaux si ADMIN ou SUPERADMIN
router.get(
  "/profiles",
  userAuth,
  checkRole(["admin", "superadmin"]),
  UserController.getAllUsers
);

module.exports = router;
