import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = ({ messages, otherUser, userId }) => {
  const lastSeenIndex = otherUser.lastMessageSeenIndex;

  return (
    <Box>
      {messages
        .map((message, i) => {
          const time = moment(message.createdAt).format("h:mm");

          return message.senderId === userId ? (
            <SenderBubble
              key={message.id}
              text={message.text}
              time={time}
              otherUserPhoto={otherUser.photoUrl}
              isLastSeen={i === lastSeenIndex}
            />
          ) : (
            <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
          );
        })
        .reverse()}
    </Box>
  );
};

export default Messages;
