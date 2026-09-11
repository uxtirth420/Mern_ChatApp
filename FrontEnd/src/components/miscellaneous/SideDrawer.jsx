import {
    Box, Button, Center, Menu, Portal, Text, Tooltip, Avatar, Float, Circle, CloseButton,
    Drawer,
    Input,
    Flex,
    Spinner,
    Toaster,
    Toast,
    createToaster,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import { FaRegBell } from "react-icons/fa6";
import { GoChevronDown } from "react-icons/go";
import ProfileModal from './ProfileModal';
import ChatLoading from '../ChatLoading';
import { useNavigate } from 'react-router-dom';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../config/ChatLogics';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';



const toaster = createToaster({ placement: 'top' });
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

      const { user,  selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/", { replace: true });
    }

    const handleSearch = async () => {
        if (!search.trim()) {
            toaster.create({
                title: "Please enter something in search",
                description: "Type a name or email to search users.",
                type: "warning",
                duration: 5000,
                closable: true,
            });
            return;
        }

        setLoading(true);

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }

            const {data} = await axios.get(
                `${BACKEND_URL}/api/user?search=${encodeURIComponent(search.trim())}`,
                config,
            );

            setLoading(false)
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            setSearchResults(data);

            if (data.length === 0) {
                toaster.create({
                    title: "User not found",
                    description: "No user matched your name or email search.",
                    type: "warning",
                    duration: 5000,
                    closable: true,
                });
            }
        } catch (error) {
            setSearchResults([]);
            toaster.create({
                title: "Search failed",
                description: error.response?.data?.message || error.message || "Failed to load the search results",
                type: "error",
                duration: 5000,
                closable: true,
            })
        } finally {
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post(`${BACKEND_URL}/api/chat`, { userId }, config);

            if(!chats.find((c) => c._id == data._id)) setChats([data, ...chats]);

            setSelectedChat(data);
            setLoadingChat(false);
        } catch (error) {
          toaster.create({  
            title: "Error fetching the Chat!",
            description: "error.message",
            type: "error",
            duration: 5000,
            closable: true,
            })
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
            <Box
                display="flex"
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'white'}
                w={'100%'}
                p={"5px 10px 5px 10px"}
                borderWidth={'5px'}
            >
                <Drawer.Root open={isDrawerOpen} onOpenChange={(e) => setIsDrawerOpen(e.open)} placement="start">
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <Drawer.Trigger asChild>
                                <Button variant="ghost" onClick={() => setIsDrawerOpen(true)}>
                                    <i className="fas fa-search"></i>
                                    <Text display={{ base: "none", sm: "flex" }} px="4">
                                        Search User
                                    </Text>
                                </Button>
                            </Drawer.Trigger>
                        </Tooltip.Trigger>
                        <Tooltip.Positioner>
                            <Tooltip.Content>
                                <Tooltip.Arrow>
                                    <Tooltip.ArrowTip />
                                </Tooltip.Arrow>
                                Search users to chat
                            </Tooltip.Content>
                        </Tooltip.Positioner>
                    </Tooltip.Root>

                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.Header>
                                    <Drawer.Title>Search Users</Drawer.Title>
                                </Drawer.Header>
                                <Drawer.Body>
                                    <Box display="flex" paddingBottom={"2px"}>
                                        <Input
                                            placeholder='Search by name or email'
                                            mr={"2px"}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <Button onClick={handleSearch}>Go</Button>
                                    </Box>
                                    {loading ? (
                                        <ChatLoading />
                                    ) : (
                                        // <span>results</span>
                                         searchResults?.map((user) => (
                                             <UserListItem key={user._id} 
                                             user={user} 
                                             handleFunction={() => accessChat(user._id) } /> 
                                        ) 
                                    )
                                )}
                                {loadingChat && <Spinner size="sm" d="flex" />}
                                </Drawer.Body>
                                <Drawer.Footer>
                                    <Drawer.ActionTrigger asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </Drawer.ActionTrigger>
                                </Drawer.Footer>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton size="sm" onClick={() => setIsDrawerOpen(false)} />
                                </Drawer.CloseTrigger>
                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                </Drawer.Root>

                <Text fontSize={'2xl'} fontFamily={'Work-sans'}>
                    Mern Chat App
                </Text>

                <div>
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <Button p={1} bg="white">
                                    <Badge badgeContent={notification.length} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                <FaRegBell
                                    style={{
                                        color: "#1f2937",
                                    }}
                                />
                            </Button>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    {!notification.length && <Menu.Item>No New Messages</Menu.Item>}
                                    {notification.map((notify) => (
                                        <Menu.Item key={notify._id} onClick={() => {
                                            setSelectedChat(notify.chat);
                                            setNotification((previousNotifications) =>
                                                previousNotifications.filter(
                                                    (notificationItem) => notificationItem.chat._id !== notify.chat._id
                                                )
                                            );
                                        }}>
                                            {notify.chat.isGroupChat
                                                ? `New Message in ${notify.chat.chatName}`
                                                : `New Message from ${getSender(user, notify.chat.users)}`}
                                        </Menu.Item>
                                    ))}
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <Button variant="surface">
                                <Avatar.Root
                                    size="sm"
                                    shape="full"
                                    cursor="pointer"
                                    mr="1">
                                    {/* <Avatar.Fallback name="Dan Abramov" /> */}
                                    <Avatar.Fallback name={user.name} />
                                    {/* <Avatar.Image src="https://bit.ly/dan-abramov" /> */}
                                    <Avatar.Image src={user.pic} />
                                    { <Float placement="bottom-end" offsetX="1" offsetY="1">
                                    <Circle
                                        bg="green.500"
                                        size="8px"
                                        outline="0.2em solid"
                                        outlineColor="bg"
                                    />
                                    </Float>}
                                </Avatar.Root>
                                <GoChevronDown
                                    style={{
                                        color: "#1f2937",
                                    }}
                                />
                            </Button>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content>
                                    <Menu.Item onClick={() => setIsProfileOpen(true)} _hover={{ cursor: 'pointer' }} cursor="pointer">Profile</Menu.Item>
                                    <Menu.Separator />
                                    <Menu.Item onClick={logoutHandler} _hover={{ cursor: 'pointer' }} cursor="pointer">
                                        Logout
                                    </Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                    <ProfileModal
                        user={user}
                        open={isProfileOpen}
                        onOpenChange={setIsProfileOpen}
                    />
                </div>
            </Box>

        </>
    );
};

export default SideDrawer

