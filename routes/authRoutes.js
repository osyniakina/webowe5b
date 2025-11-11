const express = require('express');

const authController = require('../controllers/authController');
const router = express.Router();

//all routes are starting from /movies
// router.get("/", (req, res) => {
//     res.send("Hello from movies");
// });

router.get('/', authController.getAll);
router.post('/', authController.create);
router.put('/:id', authController.update);
router.delete('/:id', authController.remove);

module.exports = router;