import io from "socket.io-client";
import store from "./store";
import { removeOfflineUser, addOnlineUser, lastSeenUpdated } from "./store/conversations";
import { receiveNewMessage } from "./store/utils/thunkCreators";

let socket = null;
const connectSocket = () => {
  if (socket) return socket;

  socket = io(window.location.origin);
  socket.on("connect", () => {
    console.log("connected to server");

    socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
    });

    socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
    });

    socket.on("new-message", (data) => {
      store.dispatch(receiveNewMessage(data.message, data.sender));
    });

    socket.on("last-seen-updated", (data) => {
      console.log("aaaaaaaa");
      store.dispatch(lastSeenUpdated(data.conversationId, data.lastSeen, data.userId));
    });
  });
  return socket;
};
export default connectSocket;
