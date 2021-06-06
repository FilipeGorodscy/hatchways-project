import axios from "axios";
import socket from "../socket";

export const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const updateLastSeen = (conversationId) => async () => {
  if (!conversationId) return;
  const lastSeen = new Date();

  await axios.patch(`/api/conversations/${conversationId}`, { lastSeen });

  socket().emit("last-seen-updated", { conversationId, lastSeen });
};

export const setActiveChat = (conversation) => async (dispatch) => {
  try {
    await updateLastSeen(conversation.id)();

    dispatch({
      type: SET_ACTIVE_CHAT,
      username: conversation.otherUser.username,
    });
  } catch (error) {
    console.error(error);
  }
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.username;
    }
    default:
      return state;
  }
};

export default reducer;
