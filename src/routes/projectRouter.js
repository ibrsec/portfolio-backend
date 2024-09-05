'use strict';


/* -------------------------------------------------------------------------- */
/*                               Category Router                              */
/* -------------------------------------------------------------------------- */
const router = require('express').Router();
const {project} = require('../controllers/projectController');
const permissons = require('../middlewares/permissions');
/* -------------------------------------------------------------------------- */

router.route('/')
.get(project.list)
.post(permissons.isAdmin,project.create);
router.route('/:id')
.get(project.read)
.put(permissons.isAdmin,project.update) 
.delete(permissons.isAdmin,project.delete)


/* -------------------------------------------------------------------------- */
module.exports = router;

