import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
    position: "relative",
    height: "100%",
    paddingBottom: "105px",
  },
  chatContainer: {
    paddingLeft: "1em",
    paddingRight: "1em",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
    width: "100%",
    overflow: "scroll",
  },
  chatInput: {
    position: "fixed",
    bottom: "0%",
    width: "100%",
  },
}));

const ActiveChat = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.user);
  const conversation = useSelector((state) => state.conversations?.[state.activeConversation]) || {};

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header username={conversation.otherUser.username} online={conversation.otherUser.online || false} />
          <Box className={classes.chatContainer}>
            <Messages messages={conversation.messages} otherUser={conversation.otherUser} userId={user.id} />
          </Box>
          <Box className={classes.chatInput}>
            <Input otherUser={conversation.otherUser} conversationId={conversation.id} user={user} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default ActiveChat;
