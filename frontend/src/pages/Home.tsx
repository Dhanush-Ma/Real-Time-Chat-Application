import { useEffect, useState } from "react";
import ChatWindow from "../Components/ChatWindow";
import Users from "../Components/Users";

const Home = () => {
  const [focuedChatWindowUserId, setFocuedChatWindowUserId] = useState("");
  

  return (
    <div className="h-screen w-screen bg-accentColor2 flex justify-center items-center">
      <div className="w-[99%] h-[99%] bg-primary rounded-xl flex overflow-hidden">
        <Users
          focuedChatWindowUserId={focuedChatWindowUserId}
          setFocuedChatWindowUserId={setFocuedChatWindowUserId}
        />
        <ChatWindow
          focuedChatWindowUserId={focuedChatWindowUserId}
          setFocuedChatWindowUserId={setFocuedChatWindowUserId}
        />
      </div>
    </div>
  );
};

export default Home;
