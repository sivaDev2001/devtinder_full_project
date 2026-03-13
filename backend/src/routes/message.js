const express = require('express');
const { userauthentication } = require('../../middlewares/auth.js');
const UserRequestConnection = require('../models/requestConnection.js');
const Message = require('../models/message.js');

const messageRouter = express.Router();

// helper to ensure two users are connected
const ensureConnected = async (loggedInUserId, otherUserId) => {
  const connection = await UserRequestConnection.findOne({
    status: 'accepted',
    $or: [
      { fromUserId: loggedInUserId, toUserId: otherUserId },
      { fromUserId: otherUserId, toUserId: loggedInUserId },
    ],
  }).select('_id');

  return !!connection;
};

// get all messages between logged-in user and another user
messageRouter.get('/messages/:userId', userauthentication, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const otherUserId = req.params.userId;

    const isConnected = await ensureConnected(loggedInUser._id, otherUserId);
    if (!isConnected) {
      return res.status(403).json({
        message: 'You are not connected with this user',
      });
    }

    const messages = await Message.find({
      $or: [
        { from: loggedInUser._id, to: otherUserId },
        { from: otherUserId, to: loggedInUser._id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      message: 'Messages fetched successfully',
      data: messages,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to fetch messages',
      error: err.message,
    });
  }
});

// send a new message to a connected user
messageRouter.post('/messages/:userId', userauthentication, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const otherUserId = req.params.userId;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({
        message: 'Message content is required',
      });
    }

    const isConnected = await ensureConnected(loggedInUser._id, otherUserId);
    if (!isConnected) {
      return res.status(403).json({
        message: 'You are not connected with this user',
      });
    }

    const message = await Message.create({
      from: loggedInUser._id,
      to: otherUserId,
      content: content.trim(),
    });

    // emit real-time event if Socket.io is available
    const io = req.app.get('io');
    if (io) {
      const payload = {
        _id: message._id,
        from: message.from,
        to: message.to,
        content: message.content,
        createdAt: message.createdAt,
      };
      io.to(loggedInUser._id.toString()).emit('chat:message', payload);
      io.to(otherUserId.toString()).emit('chat:message', payload);
    }

    return res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to send message',
      error: err.message,
    });
  }
});

module.exports = messageRouter;

