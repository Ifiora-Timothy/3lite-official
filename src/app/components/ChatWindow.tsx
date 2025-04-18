import SendMsgComponent from "./SendMsgComponent";
import ChatsContainer from "./ChatsContainer";

const ChatWindow = () => {
  return (
    <div className="border-r flex flex-col h-full">
      <ChatsContainer />
      <SendMsgComponent />
    </div>
  );
};

export default ChatWindow;
