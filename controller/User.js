const User = require("../models/User");

/**
 * @DESC Affiche tout les utilisateurs si admin ou superadmin
*/
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(201).json({
          message: "All users fetched !",
          users
        });
    } catch(error) {
      return res.status(500).json({
        message: "user not fechted!",
        error
      });
    }
  }

  module.exports = {
      getAllUsers
  }