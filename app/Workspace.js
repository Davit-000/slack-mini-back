const User = require('./User');
const { Model } = require('objection');

class Workspace extends Model {
  static get tableName() {
    return 'workspaces';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'sub_domain'],
      properties: {
        id: {type: 'integer', 'autoIncrement': true },
        name: {type: 'string', minLength: 1, maxLength: 255},
        sub_domain: {type: 'string', unique: true, minLength: 1, maxLength: 255},
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'workspaces.user_id',
          to: 'users.id',
        }
      }
    };
  }
}

module.exports = Workspace;
