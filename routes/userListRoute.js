const { addUserList, removeUserList, removeAllUserList, showUserList, updateUserList } = require('../controllers/userListController');

const router = require("express").Router();

router.post("/addUserList", addUserList);
router.post("/removeUserList", removeUserList);
router.delete("/removeAllUserList", removeAllUserList);
router.get("/showUserList", showUserList);
router.get("/updateUserList", updateUserList);

module.exports = router;