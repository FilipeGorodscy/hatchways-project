export const addMessageToStore = (state, payload) => {
  const { message, sender, activeConversation } = payload;

  const conversation = state.find((convo) => convo.id === message.conversationId);
  if (!conversation) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unseenMessageCount: 1,
    };
    newConvo.latestMessageText = message.text;

    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.unshift(message);
      convoCopy.latestMessageText = message.text;
      if (message.senderId === convo.otherUser.id && convo.otherUser.username !== activeConversation) {
        convoCopy.unseenMessageCount += 1;
      } else {
        convoCopy.otherUser.lastMessageSeenIndex += 1;
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.unshift(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const clearUnseenMessages = (state, action) =>
  state.map((convo) => {
    if (convo.otherUser.username === action.username) {
      const convoCopy = { ...convo, unseenMessageCount: 0 };
      return convoCopy;
    } else {
      return convo;
    }
  });

export const updateOtherUserLastSeen = (state, payload) => {
  return state.map((convo) => {
    if (convo.otherUser.id !== payload.userId) return convo;

    const lastMessageSeenIndex = convo.messages.findIndex((message) => {
      if (message.senderId !== payload.userId) {
        return message.updatedAt < payload.lastSeen;
      }
      return false;
    });
    console.log(convo.messages);
    return {
      ...convo,
      lastSeenOtherUser: payload.lastSeen,
      otherUser: {
        ...convo.otherUser,
        lastMessageSeenIndex,
      },
    };
  });
};
