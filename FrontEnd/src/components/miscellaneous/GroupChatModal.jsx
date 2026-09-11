// import UserBadgeItem from '../UserAvatar/UserBadgeItem';
// import UserListItem from "../UserAvatar/UserListItem";
// import { ChatState } from '../../Context/ChatProvider';
// import { Toaster,
//          Toast,
//          createToaster,
//          Dialog,
//          Field,
//          Button,
//          Fieldset, Input, 
//          CloseButton,
//          Box} from '@chakra-ui/react';
// import { useState } from 'react';
// import axios from 'axios';


// const toaster = createToaster({ placement: 'top' });
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


// const GroupChatModal = ( { children } ) => {


//   const [groupChatName, setGroupChatName] = useState();
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [searchResult, setSearchResult] = useState([]);
//   const [loading, setLoading] = useState(false); 
//   const { user, setChats } = ChatState();

//   const handleSubmit = async () => {
//     // setOpen(false)
//     if(!groupChatName || selectedUsers.length < 2) {
//       toaster.create({  
//             title: "Please fill all the fields",
//             // description: error.message || "Failed to load the Search Results",
//             type: "warning",
//             duration: 5000,
//             closable: true,
//           })
//           return;
//     }

//     try {
       
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//        };
  
//        const { data } = await axios.post(`${BACKEND_URL}/api/chat/group`, {
//         name: groupChatName,
//         users: JSON.stringify(selectedUsers.map((u) => u._id)),
//        },
//       config
//       );

//       setChats((previousChats) => [data, ...previousChats]);
//       toaster.create({
//           title: "New Group Chat Created.",
//           // description: error.message || "Failed to load the Search Results",
//           type: "success",
//           duration: 5000,
//           closable: true,
//       })

//     }catch(error) {
//       toaster.create({
//           title: "Failed to create Group Chat!",
//           description: error.response?.data?.message || error.message || "Failed to create group chat",
//           type: "error",
//           duration: 5000,
//           closable: true,
//       })
//     }
//   }

//   const handleSearch = async (query) => {
//     if(!query.trim()) {
//       setSearchResult([]);
//       return;
//     }

//     try {
//        setLoading(true);

//        const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//        };

//        const { data } = await axios.get(`${BACKEND_URL}/api/user?search=${encodeURIComponent(query)}`, config)
//        setSearchResult(data)
//     }catch(error) {
//       toaster.create({  
//             title: "Error Occured!",
//             description: error.message || "Failed to load the Search Results",
//             type: "error",
//             duration: 5000,
//             closable: true,
//           })

//     } finally {
//       setLoading(false);
//     }
//   }
  
//   const handleGroup = (userToAdd) => {
//     if(selectedUsers.includes(userToAdd)) {
//       toaster.create({  
//             title: "User already added",
//             type: "warning",
//             duration: 5000,
//             closable: true,
//           });
//           return;
//     }

//     setSelectedUsers([...selectedUsers, userToAdd])
//   }

//   const handleDelete = (delUser) => {
//     setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
//   }

//   return (
//     <>
//           <Toaster toaster={toaster}>
//                  {(toast) => (
//                     <Toast.Root key={toast.id} type={toast.type}>
//                      <Toast.Title>{toast.title}</Toast.Title>
//                      <Toast.Description>{toast.description}</Toast.Description>
//                     </Toast.Root>
//                   )}
//           </Toaster>

//           {/* <Button onClick={() => setOpen(true)}>Open Modal</Button> */}

//       <Dialog.Root >  {/* open={open} onOpenChange={(e) => setOpen(e.open)} */}
//        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
//         <Dialog.Backdrop />
//         <Dialog.Positioner>
//           <Dialog.Content>
//               <Dialog.Header fontSize="40px" fontFamily="Work sans" display="flex" justifyContent="center">
//                 <Dialog.Title>
//                     Create Group Chat  
//                 </Dialog.Title>
//               </Dialog.Header>
              
//               <Dialog.CloseTrigger asChild>
//                           <CloseButton size="sm" />
//               </Dialog.CloseTrigger>

//               <Dialog.Body display="flex" flexDirection="column" alignItems="center">
//                 <Fieldset.Root>
//                   <Fieldset.Content>
//                     <Field.Root>
//                       {/* <Field.Label>Name</Field.Label> */}
                      
//                       <Input name="name" placeholder='Chat Name' mb={3}
//                       onChange={(e) => { setGroupChatName(e.target.value)}}
//                       />
//                     </Field.Root>
//                     <Field.Root>
//                       {/* <Field.Label>Name</Field.Label> */}
                      
//                       <Input name="name" placeholder='Add Users eg: Jhon, Tirth, Jane' mb={1}
//                       onChange={(e) => { handleSearch(e.target.value)}}
//                       />
//                     </Field.Root>
//                   </Fieldset.Content>
//                   <Box width="100%" display="flex" flexWrap="wrap">
//                    {selectedUsers.map((u) => (
//                     <UserBadgeItem 
//                     key={u._id} 
//                     user={u} 
//                     handleFunction={() => handleDelete(u)}/>
//                    ))}
//                   </Box>

//                          {loading ? <div>loading</div> : (
//                           searchResult?.slice(0, 4).map(user => 
//                           <UserListItem 
//                           key={user._id} 
//                           user={user} 
//                           handleFunction={()=> handleGroup(user)}/>)
//                          )}
//                   {/* render searched users */}
//                 </Fieldset.Root>
//               </Dialog.Body>
//               <Dialog.Footer>
//                 <Button colorScheme="blue" onClick={handleSubmit}> Create Chat</Button>
//               </Dialog.Footer>
//           </Dialog.Content>
//         </Dialog.Positioner>
//       </Dialog.Root>
//     </>
//   )
// }

// export default GroupChatModal




import React, { useState } from 'react';
import { 
  Toaster, 
  Toast, 
  createToaster, 
  Dialog, 
  Field, 
  Button, 
  Fieldset, 
  Input, 
  CloseButton, 
  Box,
  VStack,
  HStack,
  Text,
  Checkbox
} from '@chakra-ui/react';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const toaster = createToaster({ placement: 'top' });
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [contactSearchQuery, setContactSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const { user, setChats } = ChatState();

  const loadContacts = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${BACKEND_URL}/api/user`, config);
      setSearchResult(data);
    } catch (error) {
      toaster.create({  
        title: "Error Occurred!",
        description: error.message || "Failed to load database contacts",
        type: "error",
        duration: 5000,
        closable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleContacts = () => {
    const nextState = !showContacts;
    setShowContacts(nextState);
    if (nextState && searchResult.length === 0) {
      loadContacts();
    }
  };

  const handleUserToggle = (userToToggle, isChecked) => {
    if (isChecked) {
      if (!selectedUsers.some(u => u._id === userToToggle._id)) {
        setSelectedUsers([...selectedUsers, userToToggle]);
      }
    } else {
      setSelectedUsers(selectedUsers.filter(u => u._id !== userToToggle._id));
    }
  };

  const handleDeleteBadge = (delUser) => {
    setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id));
  };

  // 1. Filter contacts locally first based on search box input text
  const filteredBaseline = searchResult.filter((item) => {
    const query = contactSearchQuery.toLowerCase();
    return (
      item.name?.toLowerCase().includes(query) || 
      item.email?.toLowerCase().includes(query)
    );
  });

  // 2. Sort/Reorder: Push selected items to the top of the array map view
  const sortedAndFilteredContacts = [...filteredBaseline].sort((a, b) => {
    const aSelected = selectedUsers.some(u => u._id === a._id);
    const bSelected = selectedUsers.some(u => u._id === b._id);
    
    if (aSelected && !bSelected) return -1; // 'a' moves up
    if (!aSelected && bSelected) return 1;  // 'b' moves up
    return 0; // maintain default position order
  });

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length < 2) {
      toaster.create({  
        title: "Please fill all fields",
        description: "A group name and at least 2 members are required.",
        type: "warning",
        duration: 5000,
        closable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      const { data } = await axios.post(
        `${BACKEND_URL}/api/chat/group`, 
        {
          name: groupChatName,
          description: groupDescription,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats((previousChats) => [data, ...previousChats]);
      setSelectedUsers([]);
      setGroupChatName("");
      setGroupDescription("");
      setContactSearchQuery("");
      setShowContacts(false);
      
      toaster.create({
        title: "New Group Chat Created.",
        type: "success",
        duration: 5000,
        closable: true,
      });
    } catch (error) {
      toaster.create({
        title: "Failed to create Group Chat!",
        description: error.response?.data?.message || error.message || "Failed to create group chat",
        type: "error",
        duration: 5000,
        closable: true,
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

      <Dialog.Root size="md" placement="center">
        <Dialog.Trigger asChild>{children}</Dialog.Trigger>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="bg.panel" borderRadius="xl">
            <Dialog.Header borderBottomWidth="1px" py={4} display="flex" justifyContent="space-between" alignItems="center">
              <Dialog.Title fontSize="xl" fontWeight="bold" color="fg.default">
                Create New Group
              </Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" variant="ghost" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            
            <Dialog.Body py={5}>
              <Fieldset.Root>
                <VStack spaceY={4} align="stretch" width="full">
                  
                  {/* Group Name */}
                  <Field.Root>
                    <Field.Label fontWeight="semibold" color="fg.muted" mb={1}>Group Name</Field.Label>
                    <Input 
                      placeholder="Enter Group Name" 
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                  </Field.Root>

                  {/* Group Members Section Control */}
                  <Box>
                    <Text fontWeight="semibold" color="fg.muted" mb={2}>
                      Group Members
                    </Text>
                    <Button 
                      size="sm" 
                      variant="subtle" 
                      colorPalette="purple" 
                      onClick={handleToggleContacts}
                      mb={2}
                    >
                      {showContacts ? "Hide Members" : "Select Members"}
                    </Button>

                    {/* Selected Badges Row Preview Window */}
                    {selectedUsers.length > 0 && (
                      <Box display="flex" flexWrap="wrap" gap={2} p={2} borderWidth="1px" borderRadius="md" bg="bg.muted" mb={2}>
                        {selectedUsers.map((u) => (
                          <UserBadgeItem 
                            key={u._id} 
                            user={u} 
                            handleFunction={() => handleDeleteBadge(u)}
                          />
                        ))}
                      </Box>
                    )}

                    {/* Contacts Toggle Drawer/Box Element Panel */}
                    {showContacts && (
                      <Box 
                        borderWidth="1px" 
                        borderRadius="md" 
                        p={3}
                        bg="bg.panel"
                      >
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="xs" fontWeight="bold" color="fg.muted" uppercase tracking="wider">
                            Contacts
                          </Text>
                          {searchResult.length > 0 && (
                            <Text fontSize="xs" color="fg.muted">
                              Showing {sortedAndFilteredContacts.length} of {searchResult.length}
                            </Text>
                          )}
                        </HStack>

                        {/* Text Search Filtration Input Element */}
                        <Input 
                          placeholder="Search contacts by name or email..." 
                          size="sm"
                          mb={3}
                          value={contactSearchQuery}
                          onChange={(e) => setContactSearchQuery(e.target.value)}
                        />
                        
                        {loading ? (
                          <Text fontSize="sm" color="fg.muted" py={2}>Loading database contacts...</Text>
                        ) : sortedAndFilteredContacts.length === 0 ? (
                          <Text fontSize="sm" color="fg.muted" py={2}>No matches found.</Text>
                        ) : (
                          <Box maxH="160px" overflowY="auto">
                            <VStack spaceY={2} align="stretch">
                              {sortedAndFilteredContacts.map((userItem) => {
                                const isChecked = selectedUsers.some(u => u._id === userItem._id);

                                return (
                                  <HStack
                                    key={userItem._id}
                                    justify="space-between"
                                    py={1}
                                    pr={2}
                                    bg={isChecked ? "purple.subtle" : "transparent"}
                                    borderRadius="sm"
                                    px={isChecked ? 2 : 0}
                                  >
                                    <Checkbox.Root
                                      checked={isChecked}
                                      onCheckedChange={(event) =>
                                        handleUserToggle(userItem, !!event.checked)
                                      }
                                    >
                                      <Checkbox.HiddenInput />
                                      <Checkbox.Control />
                                      <Checkbox.Label fontSize="sm" fontWeight="medium" cursor="pointer">
                                        {userItem.name}
                                      </Checkbox.Label>
                                    </Checkbox.Root>
                                  </HStack>
                                );
                              })}
                            </VStack>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>

                  <Field.Root>
                    <Field.Label fontWeight="semibold" color="fg.muted" mb={1}>
                      Description
                    </Field.Label>
                    <Input
                      placeholder="Enter Description"
                      value={groupDescription}
                      onChange={(event) => setGroupDescription(event.target.value)}
                    />
                  </Field.Root>
                </VStack>
              </Fieldset.Root>
            </Dialog.Body>

            <Dialog.Footer borderTopWidth="1px" p={4} display="flex" justifyContent="flex-end" gap={3}>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Close</Button>
              </Dialog.ActionTrigger>
              <Button colorPalette="blue" onClick={handleSubmit}>
                Create Group
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default GroupChatModal;