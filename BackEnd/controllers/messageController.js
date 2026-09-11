const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel')
const User = require('../models/userModel');
const Chat = require('../models/chatModel');

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic email");
    message = await message.populate({
      path: "chat",
      populate: {
        path: "users",
        select: "name pic email",
      },
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const markMessagesRead = asyncHandler(async (req, res) => {
  await Message.updateMany(
    {
      chat: req.params.chatId,
      sender: { $ne: req.user._id },
      readBy: { $ne: req.user._id },
    },
    { $addToSet: { readBy: req.user._id } }
  );

  res.sendStatus(204);
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    await Message.updateMany(
      {
        chat: req.params.chatId,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      },
      { $addToSet: { readBy: req.user._id } }
    );

    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate({
        path: "chat",
        populate: {
          path: "users",
          select: "name pic email",
        },
      });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findById(messageId);

  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  if (message.sender.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      message: "You can only delete your own messages",
    });
  }

  const deletedMessage = await Message.findByIdAndDelete(messageId);

  if (deletedMessage.chat) {
    const latestMessage = await Message.findOne({ chat: deletedMessage.chat })
      .sort({ createdAt: -1 })
      .lean();

    await Chat.findByIdAndUpdate(deletedMessage.chat, {
      latestMessage: latestMessage?._id || null,
    });
  }

  res.json({
    messageId: deletedMessage._id,
    chatId: deletedMessage.chat,
    success: true,
  });
});

module.exports = { sendMessage, allMessages, markMessagesRead, deleteMessage }