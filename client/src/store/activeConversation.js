import axios from "axios";

export const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const updateLastSeen = (conversationId) => async () => {
  if (!conversationId) return;
  await axios.patch(`/api/conversations/${conversationId}`);
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
