const User = require('../User');
const validator = require('validator');
const { omit } = require('lodash');
const { ValidationError, UniqueViolationError } = require('objection');

class AuthController {
  static register = async (req, res) => {
    try {
      const {email, password, password_confirmation } = req.body;

      if (!validator.equals(password, password_confirmation)) {
        throw new ValidationError({
          statusCode: 422,
          type: "ModelValidation",
          data: {
            password: ["The Passwords not match."]
          }
        });
      }

      if (!validator.isEmail(email)) {
        throw new ValidationError({
          statusCode: 422,
          type: "ModelValidation",
          data: {
            email: ["The field must be valid email address."]
          }
        })
      }

      const user = await User.query().insert(omit(req.body, ['password_confirmation']));
      const token = await user.generateAuthToken();

      res.status(201).json({ user, token });
    } catch (e) {
      if (e instanceof ValidationError) {
        return res.status(422).json(e.data);
      } else if (e instanceof UniqueViolationError) {
        return res.status(422).json({email: ["An email already has been taken."]});
      }

      res.status(500).send(e.message);
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      if (!validator.isEmail(email)) {
        throw new ValidationError({
          statusCode: 422,
          type: "ModelValidation",
          data: {
            email: ["The field must be valid email address."]
          }
        })
      }

      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken()

      res.status(200).json({user, token});
    } catch (e) {
      if (e instanceof ValidationError) {
        return res.status(422).json(e.data);
      }

      res.status(500).send(e.message);
    }
  };

  static logout = async (req, res) => {
    await req.user.$query().patch({api_token: null});

    res.status(200).send('Logged out');
  };

  static user = async (req, res) => {
    res.send(req.user);
  };
}

module.exports = AuthController;
