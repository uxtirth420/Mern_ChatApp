import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';
import { Toaster, Toast, createToaster, Box, Button, Text, Stack, Avatar } from '@chakra-ui/react';
import { IoIosAdd } from "react-icons/io";
import ChatLoading from "./ChatLoading"
import { getSender } from './config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const toaster = createToaster({ placement: 'top' });
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const MyChats = ( {fetchAgain} ) => {
     const [loggedUser, setLoggedUser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();

    const formatMessageTime = (date) => {
      if (!date) return '';

      const messageDate = new Date(date);
      if (Number.isNaN(messageDate.getTime())) return '';

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfMessageDay = new Date(
        messageDate.getFullYear(),
        messageDate.getMonth(),
        messageDate.getDate()
      );
      const daysSinceMessage = Math.floor(
        (startOfToday - startOfMessageDay) / (24 * 60 * 60 * 1000)
      );

      if (daysSinceMessage === 0) {
        return new Intl.DateTimeFormat([], {
          hour: 'numeric',
          minute: '2-digit',
        }).format(messageDate);
      }

      if (daysSinceMessage === 1) return 'Yesterday';

      if (daysSinceMessage >= 2 && daysSinceMessage < 7) {
        return new Intl.DateTimeFormat([], {
          weekday: 'long',
        }).format(messageDate);
      }

      return new Intl.DateTimeFormat([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(messageDate);
    };

    const getMessagePreview = (chat) => {
      if (!chat.latestMessage) return 'No messages yet';

      const senderName = chat.latestMessage.sender?._id === user?._id ? 'You' : '';

      return `${senderName ? `${senderName}: ` : ''}${chat.latestMessage.content}`;
    };

    const getChatAvatar = (chat) => {
      if (chat.isGroupChat) return chat.users?.[0]?.pic;

      return chat.users?.find((chatUser) => chatUser._id !== loggedUser?._id)?.pic;
    };

    const fetchChats = async () => {
    // console.log(user._id);
    if (!user?.token) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${BACKEND_URL}/api/chat`, config);
      setChats(Array.isArray(data) ? data : []);
    } catch (error) {
      toaster.create({
        title: "Failed to load chats",
        description: error.response?.data?.message || error.message || "Unable to load chats",
        type: "error",
        duration: 5000,
        closable: true,
      });
    }
  };

    useEffect(() => {
     setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
     fetchChats();
    }, [user, fetchAgain])
      

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
    <Box
        padding="3"
        borderWidth="1px"
        borderRadius="lg"
        width={{ base: "100%", md: "31%" }}
        bg="white"
        display={{ base: selectedChat ? "none" : "flex", md: "flex"}}
        flexDirection="column"
        alignItems="center"
    >
         <Box
            fontFamily="Work sans"
            fontSize={{ base: "28px", md: "30px"}}
            paddingBottom={3}
            paddingInline={3}
            display={'flex'}
            width={"100%"}
            justifyContent="space-between"
            alignItems="center"
         >
           My Chats
           <GroupChatModal>
            <Button
               display='flex'
               fontSize={{ base: "17px", md: "13px", lg: "17px" }}
               gap={1}
            >
              New Group Chat
              <IoIosAdd size={30} />
            </Button>
            </GroupChatModal> 
          </Box> 
          <Box
            display="flex"
            flexDirection="column"
            p={3}
            bg="#F8F8F8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"        // overflowY={{ base: "visible", md: "hidden" }}
          >
              {chats ?  (
                 <Stack overflowY="scroll" width="100%">
                  {loggedUser && chats.map((chat)=> {
                    const isSelected = selectedChat?._id === chat._id;
                    const unreadCount = notification.filter(
                      (message) => message.chat?._id === chat._id
                    ).length;
                    const chatTitle = chat.isGroupChat
                      ? chat.chatName
                      : getSender(loggedUser, chat.users);

                    return (
                     <Box
                      onClick={ () => {
                        setSelectedChat(chat);
                        setNotification((previousNotifications) =>
                          previousNotifications.filter(
                            (message) => message.chat?._id !== chat._id
                          )
                        );
                      }}
                      cursor="pointer"
                      bg={isSelected ? "#38B2AC" : "#E8E8E8"}
                      color={isSelected ? "white" : "black"}
                      display="flex"
                      alignItems="center"
                      gap="3"
                      px="3"
                      py="2"
                      borderRadius="lg"
                      key={chat._id}
                     >
                      <Avatar.Root size="md" flexShrink={0}>
                        <Avatar.Fallback name={chatTitle} />
                        <Avatar.Image src={getChatAvatar(chat)} />
                      </Avatar.Root>
                      <Box minW={0} flex="1">
                        <Text fontWeight="semibold" truncate>{chatTitle}</Text>
                        <Text fontSize="sm" color={isSelected ? "white" : "gray.600"} truncate>
                          {getMessagePreview(chat)}
                        </Text>
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap="2" flexShrink={0}>
                        <Text fontSize="xs" color={isSelected ? "white" : "gray.500"}>
                          {formatMessageTime(chat.latestMessage?.createdAt)}
                        </Text>
                        {unreadCount > 0 && (
                          <Box
                            display="inline-flex"
                            alignItems="center"
                            justifyContent="center"
                            minW="22px"
                            h="22px"
                            px="1"
                            borderRadius="full"
                            bg={isSelected ? "white" : "#D53F8C"}
                            color={isSelected ? "#38B2AC" : "white"}
                            fontSize="xs"
                            fontWeight="bold"
                          >
                            {unreadCount}
                          </Box>
                        )}
                      </Box>
                     </Box>
                    );
                  })}
                 </Stack>
               ) : (
                <ChatLoading /> 
              )}

          </Box>
    </Box>
    </>
  )
}

export default MyChats