const { Op, DataTypes } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {
  lastSeenUser1: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastSeenUser2: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// find conversation given two user Ids

Conversation.findConversation = async function (user1Id, user2Id) {
  const conversation = await Conversation.findOne({
    where: {
      user1Id: {
        [Op.or]: [user1Id, user2Id],
      },
      user2Id: {
        [Op.or]: [user1Id, user2Id],
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

// find conversation by conversation id

Conversation.findById = async function (id) {
  const conversation = await Conversation.findOne({
    where: { id },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
