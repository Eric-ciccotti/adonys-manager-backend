const User = require("../models/User");
const passport = require("passport");



const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};



const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware qui vérifie si il y a un token jwt
 */
const userAuth = passport.authenticate("jwt", { session: false });

/**
 * @DESC Verification de role middleware
 */
const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json("Unauthorized")
    : next();



/**
 * @DESC retourne un object avec toute les infos d'un user sauf le mot de passe
 */
const serializeUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    name: user.name,
    _id: user.id,
    updatedAt: user.updatedAt,
    createdAt: user.createdAt,
  };
};

module.exports = {
  checkRole,
  serializeUser,
  validateEmail,
  validateUsername,
  userAuth
};
