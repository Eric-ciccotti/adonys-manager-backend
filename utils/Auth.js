const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const { SECRET } = require("../config/index");
const passport = require("passport");

/**
 * @DESC Enregister un utilisateur(ADMIN, SUPER_ADMIN, USER)
 */
const userRegistration = async (userDetails, role, res) => {
  try {
    //valider l'utilisateur
    let usernameNotTaken = await validateUsername(userDetails.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false,
      });
    }

    //valider l'email
    let emailNotRegistred = await validateEmail(userDetails.email);
    if (!emailNotRegistred) {
      return res.status(400).json({
        message: `This email is already taken.`,
        success: false,
      });
    }

    //Obtention du password haché
    const password = await bcrypt.hash(userDetails.password, 12);

    //création de l'utilisateur
    const newUser = new User({
      ...userDetails,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: `You are successfully registred!.`,
      success: true,
    });
  } catch (error) {
    //Implémentation d'une fonction de log (avec winston)
    return res.status(500).json({
      message: `Unable to create your account.`,
      success: false,
    });
  }
};


/**
 * @DESC Login d'un utilisateur(ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCredentials, role, res) => {
  let { username, password } = userCredentials;
  //Controle du username dans la database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: `Username is not found. Invalid login credentials.`,
      success: false,
    });
  }
  //Controle du role
  if (user.role !== role) {
    return res.status(403).json({
      message: `Please make sure you are logging on the right portal.`,
      success: false,
    });
  }

  //Controle du password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    //récupération du token et transmission à l'utilisateur
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.name,
        email: user.email,
      },
      SECRET,
      { expiresIn: "7 days" }
    );

    //Résultat
    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: `you are logged in !`,
      success: true,
    });
  } else {
    return res.status(403).json({
      message: `Incorrect password.`,
      success: false,
    });
  }
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

// AVANT REFACTO
// {
//   if (roles.includes(req.user.role)) {
//     return next();
//   }
//   return res.status(401).json({
//     message: "Unauthorized",
//     success: false,
//   });
// }

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

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
  userAuth,
  userRegistration,
  userLogin,
  serializeUser
};
