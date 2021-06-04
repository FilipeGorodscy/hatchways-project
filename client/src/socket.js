import io from "socket.io-client";
import store from "./store";
import { setNewMessage, removeOfflineUser, addOnlineUser } from "./store/conversations";

let socket = null;
const connectSocket = () => {
  if (socket) return socket;

  socket = io(window.location.origin);
  socket.on("connect", () => {
    console.log("connected to server");
    console.log(socket);

    socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
    });

    socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
    });
    socket.on("new-message", (data) => {
      store.dispatch(setNewMessage(data.message, data.sender));
    });
  });
  return socket;
};

export default connectSocket;
