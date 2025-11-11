const express = require('express');

const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

//all routes are starting from /movies
// router.get("/", (req, res) => {
//     res.send("Hello from movies");
// });

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;