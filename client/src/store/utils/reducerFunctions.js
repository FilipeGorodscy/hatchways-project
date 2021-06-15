export const addMessageToStore = (state, payload) => {
  const { message, sender, activeConversation } = payload;

  const conversation = Object.values(state).find((convo) => convo.id === message.conversationId);
  if (!conversation) {
    return {
      ...state,
      [sender.username]: {
        id: message.conversationId,
        otherUser: sender,
        messages: [message],
        unseenMessageCount: 1,
        latestMessageText: message.text,
      },
    };
  }

  return Object.fromEntries(
    Object.entries(state).map((entry) => {
      const [username, convo] = entry;

      if (convo.id === message.conversationId) {
        const convoCopy = { ...convo };
        convoCopy.messages.unshift(message);
        convoCopy.latestMessageText = message.text;
        if (message.senderId === convo.otherUser.id && username !== activeConversation) {
          convoCopy.unseenMessageCount += 1;
        } else {
          convoCopy.otherUser.lastMessageSeenIndex += 1;
        }
        return [username, convoCopy];
      } else {
        return entry;
      }
    })
  );
};

export const addOnlineUserToStore = (state, username) => {
  return {
    ...state,
    [username]: {
      ...state[username],
      otherUser: {
        ...state[username]?.otherUser,
        online: true,
      },
    },
  };
};

export const removeOfflineUserFromStore = (state, username) => {
  return {
    ...state,
    [username]: {
      ...state[username],
      otherUser: {
        ...state[username].otherUser,
        online: false,
      },
    },
  };
};

export const addSearchedUsersToStore = (state, users) => {
  const fakeConvos = users.reduce((result, user) => {
    result[user.username] = { otherUser: user, messages: [] };
    return result;
  }, {});

  return {
    ...fakeConvos,
    ...state,
  };
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return Object.fromEntries(
    Object.entries(state).map((entry) => {
      const [username, convo] = entry;

      if (convo.otherUser.id === recipientId) {
        const newConvo = {
          ...convo,
          id: message.conversationId,
          latestMessageText: message.text,
        };
        newConvo.messages.unshift(message);
        return [username, newConvo];
      } else {
        return entry;
      }
    })
  );
};

export const clearUnseenMessages = (state, action) => ({
  ...state,
  [action.username]: {
    ...state[action.username],
    unseenMessageCount: 0,
  },
});

export const updateOtherUserLastSeen = (state, payload) => {
  const convo = state[payload.user.username];

  if (!convo) return state;

  const lastMessageSeenIndex = convo.messages.findIndex((message) => {
    if (message.senderId !== payload.user.id) {
      return message.updatedAt < payload.lastSeen;
    }
    return false;
  });

  return {
    ...state,
    [payload.user.username]: {
      ...convo,
      lastSeenOtherUser: payload.lastSeen,
      otherUser: {
        ...convo.otherUser,
        lastMessageSeenIndex,
      },
    },
  };
};
