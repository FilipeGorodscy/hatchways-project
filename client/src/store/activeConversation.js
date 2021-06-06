import axios from "axios";

const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (conversation) => async (dispatch) => {
  try {
    if (conversation.id) {
      const lastSeen = new Date();

      await axios.patch(`/api/conversations/${conversation.id}`, { lastSeen });
    }
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
