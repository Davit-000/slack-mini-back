const {isUndefined} = require('lodash');
const Workspace = require('../Workspace');

const MAX_SUGGESTIONS = 3

class WorkspacesController {
  static index = async (req, res) => {
    try {
      const workspaces = await req.user
        .$relatedQuery('workspaces')
      // .orderBy('name');

      res.status(200).json({workspaces});
    } catch (e) {
      res.send(e);
    }
  };

  static store = async (req, res) => {
    try {
      const workspace = await req.user
        .$relatedQuery('workspaces')
        .insert(req.body);

      res.status(201).json({workspace});
    } catch (e) {
      res.status(e.statusCode).json(e.data);
    }
  };

  static update = async (req, res) => {
    try {
      const workspace = await Workspace
        .query()
        .patchAndFetchById(req.params.id, req.body);

      if (isUndefined(workspace)) {
        return res.status(404).send('Not found.');
      }

      res.status(200).json({workspace});
    } catch (e) {
      res.status(e.statusCode).json(e.data);
    }
  };

  static destroy = async (req, res) => {
    try {
      const workspace = await req.user
        .$relatedQuery('workspaces')
        .deleteById(req.params.id);

      if (workspace === 0) {
        return res.status(404).send('Not found.');
      }

      res.status(200).json({message: 'deleted.'});
    } catch (e) {
      res.status(e.statusCode).json(e.data);
    }
  };

  static suggest = async (req, res) => {
    try {
      const {term} = req.query;

      const match = await Workspace.query()
        .where('sub_domain', '=', term)
        .first()

      if (!match) {
        return res.status(200).json([term])
      }

      /** @type {Array} **/
      const workspaces = await Workspace.query()
        .where('sub_domain', 'LIKE', `%${term}%`)
        .pluck('sub_domain')

      const suggestions = Array(workspaces.length + MAX_SUGGESTIONS - 1)
        .fill(undefined)
        .map((item, i) => !workspaces.includes(term + i) ? term + i : undefined)
        .filter(Boolean)

      return res.status(200).json(suggestions);
    } catch (e) {
      console.log(e);

      return res.send(e);
    }
  };
}

module.exports = WorkspacesController;
