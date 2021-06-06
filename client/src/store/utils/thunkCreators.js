import axios from "axios";
import { clearOnLogout } from "..";
import socket from "../../socket";
import { gotConversations, addConversation, setNewMessage, setSearchedUsers } from "../conversations";
import { gotCsrfToken } from "../token";
import { gotUser, setFetchingStatus } from "../user";

// USER THUNK CREATORS

export const getCsrfToken = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/auth/csrf-token");
    dispatch(gotCsrfToken(data.csrfToken));
  } catch (error) {
    console.log(error);
  }
};

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket().emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch, getState) => {
  try {
    let csrfToken = getState().token;
    if (!csrfToken) {
      const res = await axios.get("/auth/csrf-token");
      csrfToken = res.data.csrfToken;
      dispatch(gotCsrfToken(csrfToken));
    }
    const { data } = await axios.post("/auth/register", credentials, {
      headers: { "X-CSRF-Token": csrfToken },
    });

    dispatch(gotUser(data));
    socket().emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch, getState) => {
  try {
    let csrfToken = getState().token;
    if (!csrfToken) {
      const res = await axios.get("/auth/csrf-token");
      csrfToken = res.data.csrfToken;
      dispatch(gotCsrfToken(csrfToken));
    }
    const { data } = await axios.post("/auth/login", credentials, {
      headers: { "X-CSRF-Token": csrfToken },
    });

    dispatch(gotUser(data));
    socket().emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch, getState) => {
  try {
    const csrfToken = getState().token;
    await axios.delete("/auth/logout", {
      headers: { "X-CSRF-Token": csrfToken },
    });
    dispatch(gotUser({}));
    dispatch(clearOnLogout());

    socket().emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message, body.sender));
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
