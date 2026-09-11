import React, {useState, useEffect, useRef, Suspense} from 'react'
import axios from 'axios'
import './styles.css'
import { ChatState } from '../Context/ChatProvider'
import { Box, Text, IconButton, Spinner, Field, Input, Toaster, Toast, createToaster } from '@chakra-ui/react';
import { IoIosArrowRoundBack } from "react-icons/io";
import { getSender, getSenderFull } from './config/ChatLogics';
import io from 'socket.io-client';
import chatBackground from '../assets/chatApp_light.jpg';

const ProfileModal = React.lazy(() => import('./miscellaneous/ProfileModal'));
const UpdateGroupChatModal = React.lazy(() => import('./miscellaneous/UpdateGroupChatModal'));
const ScrollableChat = React.lazy(() => import('./ScrollableChat'));

// const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");
const ENDPOINT = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"; // Backend server url.
const toaster = createToaster({ placement: 'top' });
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SingleChat = ( {fetchAgain, setFetchAgain} ) => {


  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const selectedChatCompareRef = useRef(null);

  const { user, selectedChat, setSelectedChat, setNotification } = ChatState();

  const clearTypingIndicator = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    setTyping(false);
    setIsOtherUserTyping(false);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${BACKEND_URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      if (socketRef.current) {
        socketRef.current.emit("join chat", selectedChat._id);
        socketRef.current.emit("messages read", {
          chatId: selectedChat._id,
          readerId: user._id,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    const socket = io(ENDPOINT);
    socketRef.current = socket;

    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on("typing", ({ chatId }) => {
      if (String(selectedChatCompareRef.current?._id) === String(chatId)) {
        setIsOtherUserTyping(true);
      }
    });
    socket.on("stop typing", ({ chatId }) => {
      if (String(selectedChatCompareRef.current?._id) === String(chatId)) {
        setIsOtherUserTyping(false);
      }
    });
    socket.on("messages read", ({ chatId, readerId }) => {
      setMessages((previousMessages) => previousMessages.map((message) => {
        if (String(message.chat?._id) !== String(chatId)) return message;

        return {
          ...message,
          readBy: [...(message.readBy || []), readerId].filter((id, index, ids) =>
            ids.findIndex((candidate) => String(candidate?._id || candidate) === String(id?._id || id)) === index
          ),
        };
      }));
    });

    socket.on("message received", (newMessageReceived) => {
      setFetchAgain((previousValue) => !previousValue);

      if (!selectedChatCompareRef.current || String(selectedChatCompareRef.current._id) !== String(newMessageReceived.chat._id)) {
        // give notification
        setNotification((previousNotifications) => {
          if (previousNotifications.some((message) => message._id === newMessageReceived._id)) {
            return previousNotifications;
          }

          return [newMessageReceived, ...previousNotifications];
        });
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        axios.put(`${BACKEND_URL}/api/message/${newMessageReceived.chat._id}/read`, {}, {
          headers: { Authorization: `Bearer ${user.token}` },
        }).then(() => {
          socket.emit("messages read", {
            chatId: newMessageReceived.chat._id,
            readerId: user._id,
          });
        });
      }
    });

    socket.on("message deleted", ({ chatId, messageId }) => {
      if (!selectedChatCompareRef.current || String(selectedChatCompareRef.current._id) !== String(chatId)) {
        return;
      }

      setMessages((previousMessages) => previousMessages.filter((message) => String(message._id) !== String(messageId)));
      setFetchAgain((previousValue) => !previousValue);
    });

    return () => {
      socket.off('connected');
      socket.off("typing");
      socket.off("stop typing");
      socket.off("messages read");
      socket.off("message received");
      socket.disconnect();
      socketRef.current = null;
      clearTypingIndicator();
    };
  }, [user]);

  useEffect( () => {
    selectedChatCompareRef.current = selectedChat;
    clearTypingIndicator();
    fetchMessages();
  }, [selectedChat]);
      
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      clearTypingIndicator();
      if (socketRef.current) {
        socketRef.current.emit("stop typing", selectedChat._id);
      }
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${BACKEND_URL}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        if (socketRef.current) {
          socketRef.current.emit("new message", data);
        }
        setFetchAgain((previousValue) => !previousValue);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        toaster.create({
          title: "Error Occured!",
          description: "Failed to send the Message",
          type: "error",
          duration: 5000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!socketConnected || !selectedChat || !socketRef.current) return;

    if (!typing) {
      setTyping(true);
      socketRef.current.emit('typing', selectedChat._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop typing', selectedChat._id);
      setTyping(false);
      setIsOtherUserTyping(false);
      typingTimeoutRef.current = null;
    }, 1500);
  }

  const deleteMessage = async (messageId) => {
    if (!selectedChat || !user?.token) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`${BACKEND_URL}/api/message/${messageId}`, config);

      setMessages((previousMessages) => previousMessages.filter((message) => String(message._id) !== String(messageId)));
      setFetchAgain((previousValue) => !previousValue);

      if (socketRef.current) {
        socketRef.current.emit('message deleted', {
          chatId: selectedChat._id,
          messageId,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to delete the Message",
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root key={toast.id} type={toast.type}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
          </Toast.Root>
        )}
      </Toaster>

      {selectedChat ? (
        <>
        <Text as="div"
           fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Back"
            onClick={() => setSelectedChat("")}
            // backgroundColor="white"
            bg="gray.100"
            _hover={{ bg: "gray.200" }}
          >
            <IoIosArrowRoundBack  color='black' size={30}/>
          </IconButton>

          {!selectedChat.isGroupChat ? (
            <> {getSender(user, selectedChat.users)} 
               <Suspense fallback={<span style={{ fontSize: '14px' }}>...</span>}>
                 <ProfileModal user={getSenderFull(user, selectedChat.users)} />
               </Suspense>
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              <Suspense fallback={<span style={{ fontSize: '14px' }}>...</span>}>
                <UpdateGroupChatModal 
                   fetchAgain={fetchAgain}
                   setFetchAgain={setFetchAgain}
                   fetchMessages={fetchMessages}
                />
              </Suspense>
            </>
          )}
           </Text>
           <Box 
              display="flex"
              flexDir="column"
              p={3}
              width="100%"
              height="100%"
              borderRadius="lg"
              overflowY="hidden"
              position="relative"
              backgroundImage={`url(${chatBackground})`}
              backgroundSize="cover"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              _before={{
                content: '""',
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                borderRadius: 'var(--chakra-radii-lg)',
              }}
              >
              <Box position="relative" zIndex={1} display="flex" flexDir="column" width="100%" height="100%" minH={0}>
                <Box flex="1" minH={0} overflow="hidden" display="flex" flexDir="column">
                  {
                    loading ? (
                      <Spinner 
                         size="xl"
                         width="20"
                         height="20"
                         alignSelf="center"
                         margin="auto"
                      /> 
                    ) : (
                      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                        <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>Loading messages...</div>}>
                          <ScrollableChat messages={messages} onDeleteMessage={deleteMessage} />
                        </Suspense>
                      </div>
                  )}
                </Box>

                <Field.Root
                  onKeyDown={sendMessage}
                  id="first-name"
                  required
                  mt={3}
                  position="relative"
                  zIndex={1}
                >
                  {isOtherUserTyping && (
                    <div className="typing-indicator" aria-label="Typing indicator" aria-live="polite">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  )}
                  <Input
                    variant="subtle"
                    bg="rgba(255,255,255,0.72)"
                    backdropFilter="blur(2px)"
                    placeholder="Enter a message.."
                    value={newMessage}
                    onChange={typingHandler}
                  />
                </Field.Root>
              </Box>
           </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  )
}
export default SingleChat;