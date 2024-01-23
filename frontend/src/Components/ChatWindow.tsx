import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { formatTimestampToDateTime } from "../utils/utils";
import { Oval } from "react-loader-spinner";

const ChatWindow = ({ focuedChatWindowUserId, setFocuedChatWindowUserId }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("");
  const [emojiPicker, setEmojiPicker] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [flag, setFlag] = useState<"new" | "ongoing">("new");
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse(localStorage.getItem("CURRENT_USER"));
  const clientId: string = currentUser.id + "-" + focuedChatWindowUserId.id;

  const [socket, setSocket] = useState<WebSocket | null>(null);

  const formatMessage = (message: string, type: "status" | "message") => {
    return {
      message,
      type,
      timestamp: Date.now(),
      userId: currentUser.id,
      to: focuedChatWindowUserId.id,
      flag,
      conversationId,
    };
  };

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Set up event listeners
    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type == "status") {
        if (data.userId != currentUser.id) setStatus(data.message);
      }
      if (data.type === "message") setMessages((prev) => [...prev, data]);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed", event);
    };
  }, [socket]);
  console.log(messages);

  useEffect(() => {
    if (!focuedChatWindowUserId) return;
    // Create a new WebSocket connection when the component mounts
    const newSocket = new WebSocket(`ws://127.0.0.1:8000/ws/${clientId}`);

    // Save the WebSocket instance in state
    setSocket(newSocket);

    // Cleanup on component unmount
    return () => {
      console.log("Closing socket");
      newSocket.close();
    };
  }, [focuedChatWindowUserId.id]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/conversation?userId=${currentUser.id}&to=${focuedChatWindowUserId.id}`
        );

        const data = await res.json();
        setConversationId(data.conversationId);
        if (data.messages !== 0) setFlag("ongoing");
        setMessages(data.messages);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, []);

  console.log(conversationId);

  const sendMessage = (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(formatMessage(message, "message")));
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log(clientId);
      if (emojiPicker) setEmojiPicker(false);
      sendMessage(message);
    }
  };

  if (!focuedChatWindowUserId) {
    return (
      <div className="bg-accentColor1  flex justify-center items-center w-[70%]">
        <p className="text-[#FFF]">Click on a user to start a chat</p>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="bg-accentColor1  flex justify-center items-center w-[70%]">
        <Oval color="#FFF" secondaryColor="#FFF" width={30} />
      </div>
    );
  }

  return (
    <div className="bg-accentColor1 w-[70%]">
      <div className="w-[97%] h-[98%] m-auto flex flex-col gap-y-2 justify-between ">
        <div className=" w-full py-4 border-b-2 border-b-black">
          <p className="text-white">
            {focuedChatWindowUserId.firstName} {focuedChatWindowUserId.lastName}
          </p>
          {/* {status && <p className="text-white text-xs">{status}</p>} */}
        </div>
        <div className="flex flex-col h-max overflow-y-scroll scrollbar justify-self-end mt-auto mb-4 gap-y-3 relative">
          {messages.map((message) => {
            return (
              <React.Fragment key={message.timestamp}>
                <div
                  ref={lastMessageRef}
                  className={`${
                    message.userId === currentUser.id
                      ? "rounded-l-md rounded-tr-md ml-auto bg-accentColor2"
                      : "rounded-tl-md rounded-r-md mr-auto bg-primary"
                  } px-2 py-3   text-white max-w-[70%] flex w-max`}
                >
                  <p className="text-ellipsis overflow-hidden break-words">
                    {message.message}
                  </p>
                </div>
                <span
                  className={`${
                    message.userId === currentUser.id ? "ml-auto" : "mr-auto"
                  } text-white text-xs italic  -mt-2`}
                >
                  {formatTimestampToDateTime(message.timestamp)}
                </span>
              </React.Fragment>
            );
          })}
        </div>
        <div className="bg-slate-500 h-max  w-full flex  bg-primary rounded-xl relative ">
          {emojiPicker && (
            <div className="w-max ml-auto mb-5 absolute bottom-[90%] right-0 z-10">
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setMessage(message + emoji.emoji);
                }}
              />
            </div>
          )}
          <input
            value={message}
            onChange={(e) => {
              socket?.send(
                JSON.stringify(formatMessage("typing...", "status"))
              );
              setMessage(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            className=" px-3 py-3 pr-14 outline-none w-full bg-[transparent] text-white"
            type="text"
            placeholder="Start by typing a message"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
            <BsEmojiSmileFill
              onClick={() => setEmojiPicker((prev) => !prev)}
              size={35}
              color="#FFF"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
