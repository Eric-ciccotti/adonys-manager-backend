const router = require("express").Router();

const UserController = require("../controller/User");

//apporte la fonction d'enregistrement d'un utilisateur
const {
  userRegistration,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
} = require("../utils/Auth");

//Users Registration Route
router.post("/registrer-user", async (req, res) => {
  await userRegistration(req.body, "user", res);
});

//Admin Registration Route
router.post("/registrer-admin", async (req, res) => {
  await userRegistration(req.body, "admin", res);
});

//Super Admin Registration Route
router.post("/registrer-super-admin", async (req, res) => {
  await userRegistration(req.body, "superadmin", res);
});

/*********************************************/

//Users Login Route
router.post("/login-user", async (req, res) => {
  await userLogin(req.body, "user", res);
});

//Admin Login Route
router.post("/login-admin", async (req, res) => {
  await userLogin(req.body, "admin", res);
});

//Super Admin Login Route
router.post("/login-super-admin", async (req, res) => {
  await userLogin(req.body, "superadmin", res);
});

/*********************************************/

//Profile Route
router.get("/profile", userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

//Voir tout les profils si ADMIN ou SUPERADMIN
router.get("/profiles", [userAuth, checkRole(['admin','superadmin']), UserController.getAllUsers])

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

module.exports = router;
