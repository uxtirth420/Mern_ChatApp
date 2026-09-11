const express = require('express');
const {accessChat, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware')

const router = express.Router();

router.route("/").post(protect, accessChat);  // chatcreate or chat-access route  &  only logged-in users can access this route.
router.route("/").get(protect, fetchChats);   // user fetching all chats.
router.route("/group").post(protect, createGroupChat);  //  for creating the group for chat.
router.route("/rename").put(protect, renameGroup);      // for renaming the group chat name.
router.route("/groupremove").put(protect, removeFromGroup);   // for particular user to remove from the group and groupadmin can remove someone from group.
router.route("/groupadd").put(protect, addToGroup);   // for anyone to add in the group.

module.exports = router;