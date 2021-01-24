const router = require('express').Router();
const auth = require('../app/middleware/Authenticate');
const WorkspacesController = require('../app/controllers/WorkspacesController');

router.get('/workspaces', auth, WorkspacesController.index);
router.post('/workspaces', auth, WorkspacesController.store);
router.patch('/workspaces/:id', auth, WorkspacesController.update);
router.delete('/workspaces/:id', auth, WorkspacesController.destroy);
router.get('/workspaces/suggest', auth, WorkspacesController.suggest);

module.exports = router;
