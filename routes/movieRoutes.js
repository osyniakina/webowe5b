const express = require('express');

const moviesController = require('../controllers/movieController');
const router = express.Router();

//all routes are starting from /movies
// router.get("/", (req, res) => {
//     res.send("Hello from movies");
// });

router.get('/', moviesController.getAll);
router.get('/:id', moviesController.getById);
router.post('/', moviesController.create);
router.put('/:id', moviesController.update);
router.delete('/:id', moviesController.remove);

module.exports = router;