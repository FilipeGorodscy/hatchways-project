const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    let { recipientId, text, conversationId, sender } = req.body;

    if (sender.id && senderId !== sender.id) {
      return res.sendStatus(403);
    }

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return res.sendStatus(404);
      const { user1Id, user2Id } = conversation;

      if (![user1Id, user2Id].includes(senderId)) {
        return res.sendStatus(403);
      }
    } else {
      // if we don't have conversation id, find a conversation to make sure it doesn't already exist
      let conversation = await Conversation.findConversation(senderId, recipientId);

      if (!conversation) {
        // create conversation
        conversation = await Conversation.create({
          user1Id: senderId,
          user2Id: recipientId,
        });
        if (onlineUsers.includes(sender.id)) {
          sender.online = true;
        }
      }
      conversationId = conversation.id;
    }
    const message = await Message.create({ senderId, text, conversationId });
    req.app.get("io").emit("new-message", {
      message,
      recipientId,
      sender,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
