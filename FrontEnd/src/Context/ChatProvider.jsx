import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    
    const [user, setUser] = useState("");
    const [selectedChat, setSelectedChat] = useState("");
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

    const navigate = useNavigate();

    
    useEffect( () => {
        const userInfo = getStoredUser();
        setUser(userInfo);

        if(!userInfo) {
           navigate("/", { replace: true });
        }
    }, [navigate]);

    return (
        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {

    return useContext(ChatContext);
}


export default ChatProvider;