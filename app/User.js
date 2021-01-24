const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Workspace = require('./Workspace');
const { Model, ValidationError } = require('objection');

const RECOMMENDED_ROUNDS = 12;

const REGEXP = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/;

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    return {
      workspaces: {
        relation: Model.HasManyRelation,
        modelClass: Workspace,
        join: {
          from: 'users.id',
          to: 'workspaces.user_id'
        }
      }
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        id: {type: 'integer', 'autoIncrement': true },
        name: {type: 'string', minLength: 1, maxLength: 255},
        email: {type: 'string', unique: true, minLength: 1, maxLength: 255},
        password: {type: 'string', minLength: 8},
        token: {
          type: 'string',
          // uniqueItems: true,
          // items: {
          //   type: 'string'
          // },
        }
      }
    };
  }

  /**
   * Find user by credentials
   *
   * @param {String} email
   * @param {String} password
   * @returns {Promise<Model<User>>}
   */
  static async findByCredentials(email, password) {
    const user = await User.query().findOne({email});

    if (!user) {
      throw new ValidationError({
        type: "ModelValidation",
        message: 'Invalid data provided!',
        data: {
          email: ['These credentials do not match our records.']
        }
      });
    }

    const passwordValid = await user.verifyPassword(password);

    if (!passwordValid) {
      throw new ValidationError({
        type: "ModelValidation",
        message: 'Invalid data provided!',
        data: {
          email: ['These credentials do not match our records.']
        }
      });
    }

    return user;
  }

  /**
   * Generate new token
   *
   * @returns {String}
   */
  async generateAuthToken() {
    const token = jwt.sign({id: this.id}, process.env.JWT_KEY)

    await this.$query().patch({api_token: token});

    return this.api_token;
  }

  /**
   * Before insert hook
   *
   * @param context
   * @returns {Promise<String | void>}
   */
  $beforeInsert(context) {
    const maybePromise = super.$beforeInsert(context);

    return Promise.resolve(maybePromise).then(() => {
      // hash the password
      return this.generateHash();
    });
  }

  /**
   * Before update hook
   *
   * @param queryOptions
   * @param context
   * @returns {Promise<String | void>}
   */
  $beforeUpdate(queryOptions, context) {
    const maybePromise = super.$beforeUpdate(queryOptions, context)

    return Promise.resolve(maybePromise).then(() => {
      if (queryOptions.patch && this.password === undefined) {
        return;
      }

      // hash the password
      return this.generateHash();
    });
  }

  /**
   * Compares a password to a Bcrypt hash
   * @param  {String} password  the password...
   * @return {Promise.<Boolean>} whether or not the password was verified
   */
  verifyPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  /**
   * Generates a Bcrypt hash
   * @return {Promise.<(String|void)>}  returns the hash or null
   */
  generateHash() {
    const password = this.password;

    if (password) {
      if (this.constructor.isBcryptHash(password)) {
        throw new Error('bcrypt tried to hash another bcrypt hash');
      }

      return bcrypt.hash(password, RECOMMENDED_ROUNDS).then(hash => {
        this.password = hash;
      });
    }

    return Promise.resolve();
  }

  /**
   * Detect rehashing for avoiding undesired effects
   * @param {String} str A string to be checked
   * @return {Boolean} True if the str seems to be a bcrypt hash
   */
  static isBcryptHash(str) {
    return REGEXP.test(str)
  }
}

module.exports = User;
