const { showUpcomingContest, showPastContest, showUsersContestPerf } = require('../controllers/contestController');

const router = require("express").Router();

router.get("/showUpcomingContest", showUpcomingContest);
router.get("/showPastContest", showPastContest);
router.post("/showUsersContestPerf", showUsersContestPerf);

module.exports = router;