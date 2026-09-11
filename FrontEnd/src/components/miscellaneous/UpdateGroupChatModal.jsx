// import {
//   Box,
//   Button,
//   Input,
//   Spinner,
//   Dialog,
//   IconButton,
//   Stack,
//   Toaster, Toast, createToaster,
// } from "@chakra-ui/react";
// import { LuEye } from "react-icons/lu"; 
// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import { ChatState } from "../../Context/ChatProvider";
// import UserBadgeItem from "../UserAvatar/UserBadgeItem";
// import UserListItem from "../UserAvatar/UserListItem";

// const toaster = createToaster({ placement: 'top' });
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


// const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [groupChatName, setGroupChatName] = useState("");
//   const [search, setSearch] = useState("");
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [renameloading, setRenameLoading] = useState(false);
//   const searchTimeoutRef = useRef(null);

//   const { selectedChat, setSelectedChat, user } = ChatState();

//   useEffect(() => {
//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, []);

//   const handleSearch = (query) => {
//     setSearch(query);

//     if (!query.trim()) {
//       setSearchResult([]);
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//       return;
//     }

//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(async () => {
//       try {
//         setLoading(true);
//         const config = {
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         const { data } = await axios.get(
//           `${BACKEND_URL}/api/user?search=${encodeURIComponent(query.trim())}`,
//           config
//         );
//         setSearchResult(data);
//       } catch (error) {
//         toaster.create({
//           title: "Error Occured!",
//           description: "Failed to Load the Search Results",
//           type: "error",
//           duration: 5000,
//         });
//       } finally {
//         setLoading(false);
//       }
//     }, 400);
//   };

//   const handleRename = async () => {
//     if (!groupChatName) return;

//     try {
//       setRenameLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.put(
//         `${BACKEND_URL}/api/chat/rename`,
//         {
//           chatId: selectedChat._id,
//           chatName: groupChatName,
//         },
//         config
//       );

//       setSelectedChat(data);
//       setFetchAgain(!fetchAgain);
//       setRenameLoading(false);
//     } catch (error) {
//       toaster.create({
//         title: "Error Occured!",
//         description: error.response?.data?.message || "Something went wrong",
//         type: "error",
//         duration: 5000,
//       });
//       setRenameLoading(false);
//     }
//     setGroupChatName("");
//   };

//   const handleAddUser = async (user1) => {
//     if (selectedChat.users.find((u) => u._id === user1._id)) {
//       toaster.create({
//         title: "User Already in group!",
//         type: "error",
//         duration: 5000,
//       });
//       return;
//     }

//     if (selectedChat.groupAdmin._id !== user._id) {
//       toaster.create({
//         title: "Only admins can add someone!",
//         type: "error",
//         duration: 5000,
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.put(
//         `${BACKEND_URL}/api/chat/groupadd`,
//         {
//           chatId: selectedChat._id,
//           userId: user1._id,
//         },
//         config
//       );

//       setSelectedChat(data);
//       setFetchAgain(!fetchAgain);
//       fetchMessages();
//       setLoading(false);
//     } catch (error) {
//       toaster.create({
//         title: "Error Occured!",
//         description: error.response?.data?.message,
//         type: "error",
//         duration: 5000,
//       });
//       setLoading(false);
//     }
//     setGroupChatName("");
//   };

//   const handleRemove = async (user1) => {
//     if (!selectedChat || !user1 || !user) return;

//     const isAdmin = selectedChat.groupAdmin?._id === user._id;

//     if (!isAdmin && user1._id !== user._id) {
//       toaster.create({
//         title: "Only admins can remove someone!",
//         type: "error",
//         duration: 5000,
//       });
//       return;
//     }

//     try {
//       setLoading(true);
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.put(
//         `${BACKEND_URL}/api/chat/groupremove`,
//         {
//           chatId: selectedChat._id,
//           userId: user1._id,
//         },
//         config
//       );

//       user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
//       setFetchAgain(!fetchAgain);
//       setLoading(false);
//     } catch (error) {
//       toaster.create({
//         title: "Error Occured!",
//         description: error.response?.data?.message || "Something went wrong",
//         type: "error",
//         duration: 5000,
//       });
//       setLoading(false);
//     }
//     setGroupChatName("");
//   };

//   return (
//     <>
//       <Toaster toaster={toaster}>
//                               {(toast) => (
//                                 <Toast.Root key={toast.id} type={toast.type}>
//                                   <Toast.Title>{toast.title}</Toast.Title>
//                                   <Toast.Description>{toast.description}</Toast.Description>
//                                 </Toast.Root>
//                               )}
//           </Toaster>
           
//       <IconButton
//         display={{ base: "flex" }}
//         aria-label="View Chat Details"
//         onClick={() => setIsOpen(true)}
//       >
//         <LuEye />
//       </IconButton>

//       <Dialog.Root
//         open={isOpen}
//         onOpenChange={(e) => setIsOpen(e.open)}
//         placement="center"
//       >
//         <Dialog.Backdrop />
//         <Dialog.Positioner>
//           <Dialog.Content>
//             <Dialog.Header>
//               <Dialog.Title
//                 fontSize="35px"
//                 fontFamily="Work sans"
//                 display="flex"
//                 justifyContent="center"
//               >
//                 {selectedChat.chatName}
//               </Dialog.Title>
//             </Dialog.Header>

//             <Dialog.CloseTrigger />
            
//             <Dialog.Body display="flex" flexDirection="column" alignItems="center">
//               <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
//                 {selectedChat.users.map((u) => (
//                   <UserBadgeItem
//                     key={u._id}
//                     user={u}
//                     admin={selectedChat.groupAdmin}
//                     handleFunction={() => handleRemove(u)}
//                   />
//                 ))}
//               </Box>

//               {/* Replaced FormControl with Stack for simpler layout in v3 */}
//               <Stack direction="row" w="100%" mb={3}>
//                 <Input
//                   placeholder="Chat Name"
//                   value={groupChatName}
//                   onChange={(e) => setGroupChatName(e.target.value)}
//                 />
//                 <Button
//                   variant="solid"
//                   colorPalette="teal"
//                   ml={1}
//                   loading={renameloading}
//                   onClick={handleRename}
//                 >
//                   Update
//                 </Button>
//               </Stack>

//               <Box w="100%" mb={1}>
//                 <Input
//                   placeholder="Add User to group"
//                   onChange={(e) => handleSearch(e.target.value)}
//                 />
//               </Box>

//               {loading ? (
//                 <Spinner size="lg" mt={4} />
//               ) : (
//                 searchResult?.map((user) => (
//                   <UserListItem
//                     key={user._id}
//                     user={user}
//                     handleFunction={() => handleAddUser(user)}
//                   />
//                 ))
//               )}
//             </Dialog.Body>

//             <Dialog.Footer>
//               <Button onClick={() => handleRemove(user)} colorPalette="red">
//                 Leave Group
//               </Button>
//             </Dialog.Footer>
//           </Dialog.Content>
//         </Dialog.Positioner>
//       </Dialog.Root>
//     </>
//   );
// };

// export default UpdateGroupChatModal;




import {
  Box,
  Button,
  Input,
  Spinner,
  IconButton,
  Stack,
  Text,
  VStack,
  HStack,
  Badge,
  Drawer,
  Image,
  Toaster,
  Toast,
  createToaster,
  Avatar,
} from "@chakra-ui/react";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";

const toaster = createToaster({ placement: "top" });
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  const { selectedChat, setSelectedChat, user } = ChatState();

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // --- API & LOGIC FUNCTIONS ---
  const handleSearch = (query) => {
    setSearch(query);

    if (!query.trim()) {
      setSearchResult([]);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(
          `${BACKEND_URL}/api/user?search=${encodeURIComponent(query.trim())}`,
          config
        );
        setSearchResult(data);
      } catch (error) {
        toaster.create({
          title: "Error Occured!",
          description: "Failed to Load the Search Results",
          type: "error",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `${BACKEND_URL}/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response?.data?.message || "Something went wrong",
        type: "error",
        duration: 5000,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({ title: "User Already in group!", type: "error", duration: 5000 });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({ title: "Only admins can add someone!", type: "error", duration: 5000 });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `${BACKEND_URL}/api/chat/groupadd`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response?.data?.message,
        type: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (!selectedChat || !user1 || !user) return;

    const isAdmin = selectedChat.groupAdmin?._id === user._id;

    if (!isAdmin && user1._id !== user._id) {
      toaster.create({ title: "Only admins can remove someone!", type: "error", duration: 5000 });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        `${BACKEND_URL}/api/chat/groupremove`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response?.data?.message || "Something went wrong",
        type: "error",
        duration: 5000,
      });
      setLoading(false);
    }
  };

  if (!selectedChat) return null;

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

      {/* Trigger */}
      <IconButton display={{ base: "flex" }} aria-label="View Chat Details" onClick={() => setIsOpen(true)} variant="ghost">
        <LuEye />
      </IconButton>

      {/* Sidebar Setup */}
      <Drawer.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} placement="end">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            
            <Drawer.Header borderBottomWidth="1px" pb={4}>
              <Drawer.Title fontSize="2xl" fontFamily="Work sans">
                {selectedChat.chatName}
              </Drawer.Title>
              <Drawer.CloseTrigger />
            </Drawer.Header>

            <Drawer.Body>
              <VStack align="flex-start" gap={6} w="100%" mt={2}>
                
                {/* 1. Update Group Name */}
                <Stack direction="row" w="100%">
                  <Input
                    placeholder="Rename Group"
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                  />
                  <Button variant="solid" colorPalette="teal" loading={renameloading} onClick={handleRename}>
                    Update
                  </Button>
                </Stack>

                {/* 2. Status Section */}
                <Box w="100%">
                  <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wider" mb={1}>
                    STATUS
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    {selectedChat.description || "This is the Group Chat description."}
                  </Text>
                </Box>

                {/* 3. Members List with Admin Label & Remove Logic */}
                <Box w="100%">
                  <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wider" mb={3}>
                    MEMBERS
                  </Text>
                  <VStack align="stretch" gap={4}>
                    {selectedChat.users.map((u) => (
                      <HStack key={u._id} justify="space-between" w="100%">
                        <HStack gap={3}>
                          <Avatar.Root size="md" flexShrink={0}>
                            <Avatar.Fallback name={u.name} />
                            {u.pic && !u.pic.includes("icon-library.com") && (
                              <Avatar.Image src={u.pic} />
                            )}
                          </Avatar.Root>
                          <Text fontSize="sm" fontWeight="medium">{u.name}</Text>
                        </HStack>
                        
                        <HStack>
                          {/* Admin Badge */}
                          {selectedChat.groupAdmin?._id === u._id && (
                            <Badge colorPalette="gray" variant="solid" fontSize="10px" px={2} py={0.5} borderRadius="md">
                              Admin
                            </Badge>
                          )}
                          
                          {/* Remove User Button (Only visible if current user is Admin AND the target user isn't themselves) */}
                          {selectedChat.groupAdmin?._id === user._id && u._id !== user._id && (
                            <Button size="xs" colorPalette="red" variant="ghost" onClick={() => handleRemove(u)}>
                              Remove
                            </Button>
                          )}
                        </HStack>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* 4. Add User Section */}
                <Box w="100%" pt={4} borderTopWidth="1px">
                  <Input
                    placeholder="Add User to group..."
                    onChange={(e) => handleSearch(e.target.value)}
                    mb={3}
                  />
                  {loading ? (
                    <Spinner size="lg" display="block" mx="auto" />
                  ) : (
                    searchResult?.map((user) => (
                      <Box key={user._id} mb={2}>
                        <UserListItem user={user} handleFunction={() => handleAddUser(user)} />
                      </Box>
                    ))
                  )}
                </Box>
              </VStack>
            </Drawer.Body>

            <Drawer.Footer borderTopWidth="1px" pt={4}>
              <Button onClick={() => handleRemove(user)} colorPalette="red" w="100%">
                Leave Group
              </Button>
            </Drawer.Footer>

          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  );
};

export default UpdateGroupChatModal;