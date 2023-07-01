const { showUserInfo, showUserRatingChange, showUserSubmission } = require('../controllers/userController');

const router = require("express").Router();

router.post("/showUserInfo", showUserInfo);
router.post("/showUserRatingChange", showUserRatingChange);
router.post("/showUserSubmission", showUserSubmission);

module.exports = router;