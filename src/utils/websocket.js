import { Client } from "@stomp/stompjs";
import { useUserStore } from "@/store/modules/user"; 

let client = null;

export const connect = (onPrivateMessageReceived) => {
  const userStore = useUserStore();

  client = new Client({
    brokerURL: "ws://localhost:8080/privateServer",
    onConnect: () => {
      client.subscribe(`/user/${userStore.userId}/queue/messages`, (message) => {
        console.log("收到私信:", message.body);
        if (onPrivateMessageReceived) {
          onPrivateMessageReceived({
            content: message.body,
            timestamp: new Date().toISOString(),
            isPrivate: true,
            receiverId: userStore.userId,
          });
        }
      });
    },
  });

  client.activate();
};

export const disconnect = () => {
  if (client) {
    client.deactivate();
  }
};

// 发送私信的函数
export const sendPrivateMessage = (senderId, receiverId, content) => {
  if (client && client.connected) {
    const message = `${senderId}:${receiverId}:${content}`;
    client.publish({
      destination: "/app/sendMessage",
      body: message,
    });

    return {
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isSelf: true,
      isPrivate: true,
    };
  }
  console.error("WebSocket未连接，无法发送消息");
  return null;
};
