const express = require('express')
const { sendMessage, allMessages, markMessagesRead, deleteMessage } = require('../controllers/messageController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/').post(protect, sendMessage)
router.route('/:messageId').delete(protect, deleteMessage)
router.route('/:chatId/read').put(protect, markMessagesRead)
router.route('/:chatId').get(protect, allMessages)

module.exports = router;
