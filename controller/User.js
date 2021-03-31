const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { SECRET } = require("../config/index");
const jwt = require("jsonwebtoken");
const Auth = require ("../utils/Auth")

/**
 * @DESC Enregister un utilisateur(ADMIN, SUPER_ADMIN, USER)
 */
 const userRegistration = async (userDetails, role, res) => {
  try {
    //valider l'utilisateur
    let usernameNotTaken = await Auth.validateUsername(userDetails.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false,
      });
    }
    //valider l'email
    let emailNotRegistred = await Auth.validateEmail(userDetails.email);
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
 const userLogin = async (userCredentials, res) => {
  let { email, password } = userCredentials;
  console.log(email);

  //Controle du username dans la database
  const user = await User.findOne({email});
  if (!user) {
    return res.status(404).json({
      message: `Utilisateur non trouvé, ou adresse mail invalide.`,
      success: false,
    });
  }
  //Controle du password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    
    //création du JWT token et transmission à l'utilisateur
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.name,
        email: user.email,
      },
      SECRET,
      { expiresIn: "1h" }
    );

    //Résultat
    let result = {
      user_id: user._id,
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


/**
 * @DESC Affiche tout les utilisateurs si admin ou superadmin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(201).json({
      message: "All users fetched !",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "user not fechted!",
      error,
    });
  }
};

/**
 * @DESC Récupérer le Role de l'utilisateur via le Password et l'email
 */
const getUserRole = async (userCredentials, res) => {
  let { email, password } = userCredentials;

  //Controle de l'email dans la database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: `Email is not found. Invalid email .`,
      success: false,
    });
  }

  //Controle du password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    //Résultat
    let role = await user.role;

    return res.status(200).json({
      role: role,
      message: `user role returned !`,
      success: true,
    });
  } else {
    return res.status(403).json({
      message: `Incorrect password.`,
      success: false,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserRole,
  userLogin,
  userRegistration
};
