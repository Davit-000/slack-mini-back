const User = require('../User');

class UsersController {
  static index = async (req, res) => {
    try {
      const users = await User.query();

      res.status(200).json({ users });
    } catch (e) {
      res.status(e.code).json({ message: e.message });
    }
  }

  show(req, res) {

  }

  create(req, res) {

  }


  store(req, res) {

  }

  edit(req, res) {

  }

  update(req, res) {

  }

  destroy(req, res) {

  }
}

module.exports = UsersController;