const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
// TODO: for scalability, implement lazy loading
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "lastSeenUser1", "lastSeenUser2"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        convoJSON.lastSeenOtherUser = convoJSON.lastSeenUser1;
        convoJSON.lastSeen = convoJSON.lastSeenUser2;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        convoJSON.lastSeenOtherUser = convoJSON.lastSeenUser2;
        convoJSON.lastSeen = convoJSON.lastSeenUser1;
        delete convoJSON.user2;
      }
      delete convoJSON.lastSeenUser1;
      delete convoJSON.lastSeenUser2;

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0]?.text;
      convoJSON.unseenMessageCount = convoJSON.messages
        .filter((message) => message.createdAt >= convoJSON.lastSeen)
        .filter((message) => message.senderId !== userId).length;

      const lastMessageSeenIndex = convoJSON.messages.findIndex((message) => {
        if (message.senderId === userId) {
          return message.createdAt <= convoJSON.lastSeenOtherUser;
        }
        return false;
      });
      convoJSON.otherUser.lastMessageSeenIndex = lastMessageSeenIndex;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.sendStatus(404);
    }
    if (conversation.user1Id === userId) {
      conversation.lastSeenUser1 = req.body.lastSeen;
    } else if (conversation.user2Id === userId) {
      conversation.lastSeenUser2 = req.body.lastSeen;
    } else {
      return res.sendStatus(403);
    }
    await conversation.save();
    await conversation.reload();
    res.json(conversation);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
