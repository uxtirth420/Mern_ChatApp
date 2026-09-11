// import React, { useState } from "react";
// import {
//   Dialog,
//   IconButton,
//   Button,
//   Image,
//   Text,
//   CloseButton,
// } from "@chakra-ui/react";
// import { LuEye } from "react-icons/lu";

// const ProfileModal = ({ user, children, open: controlledOpen, onOpenChange }) => {
//   const [internalOpen, setInternalOpen] = useState(false);
//   const isControlled = controlledOpen !== undefined;
//   const open = isControlled ? controlledOpen : internalOpen;

//   const handleOpenChange = (event) => {
//     if (!isControlled) {
//       setInternalOpen(event.open);
//     }
//     onOpenChange?.(event.open);
//   };

//   return (
//     <Dialog.Root open={open} onOpenChange={handleOpenChange} size="lg" placement="center">
//       {!isControlled && (children ? (
//         <Dialog.Trigger asChild>{children}</Dialog.Trigger>
//       ) : (
//         <Dialog.Trigger asChild>
//           <IconButton display={{ base: "flex" }} aria-label="View Profile">
//             <LuEye />
//           </IconButton>
//         </Dialog.Trigger>
//       ))}

//       <Dialog.Backdrop />
//       <Dialog.Positioner>
//         <Dialog.Content h="410px">
//           <Dialog.Header display="flex" justifyContent="center">
//             <Dialog.Title fontSize="40px" fontFamily="Work sans">
//               {user?.name || "Profile"}
//             </Dialog.Title>
//           </Dialog.Header>

//           <Dialog.CloseTrigger asChild>
//             <CloseButton size="sm" />
//           </Dialog.CloseTrigger>

//           <Dialog.Body
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             justifyContent="space-between"
//           >
//             {user?.pic && !user.pic.includes("icon-library.com") ? (
//               <Image
//                 borderRadius="full"
//                 boxSize="150px"
//                 src={user.pic}
//                 alt={user.name || "Profile"}
//               />
//             ) : (
//               <Text fontSize="8xl">{user?.name?.[0] || "?"}</Text>
//             )}
//             <Text fontSize={{ base: "28px", md: "30px" }} fontFamily="Work sans">
//               Email: {user?.email || "No email available"}
//             </Text>
//           </Dialog.Body>

//           <Dialog.Footer>
//             <Dialog.ActionTrigger asChild>
//               <Button>Close</Button>
//             </Dialog.ActionTrigger>
//           </Dialog.Footer>
//         </Dialog.Content>
//       </Dialog.Positioner>
//     </Dialog.Root>
//   );
// };

// export default ProfileModal




import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  Button,
  Image,
  Text,
  VStack,
  HStack,
  Separator,
  Box,
  Grid,
} from "@chakra-ui/react";
import { LuEye } from "react-icons/lu";
import { FiMail, FiFileText, FiDownload, FiArrowLeft } from "react-icons/fi";

const ProfileModal = ({ user, children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (event) => {
    if (!isControlled) {
      setInternalOpen(event.open);
    }
    onOpenChange?.(event.open);
  };

  const closeDrawer = () => {
    if (!isControlled) {
      setInternalOpen(false);
    }
    onOpenChange?.(false);
  };

  return (
    <Drawer.Root 
      open={open} 
      onOpenChange={handleOpenChange} 
      placement="right" 
      size="md"
    >
      {!isControlled && (children ? (
        <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      ) : (
        <Drawer.Trigger asChild>
          <IconButton display={{ base: "flex" }} aria-label="View Profile">
            <LuEye />
          </IconButton>
        </Drawer.Trigger>
      ))}

      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content 
          bg="bg.panel" 
          boxShadow="lg" 
          height="100vh"
          display="flex"
          flexDirection="column"
          borderLeftWidth="1px"
        >
          {/* Top Header with Responsive Back/Close Trigger */}
          <Drawer.Header borderBottomWidth="1px" py={4} px={4}>
            <HStack spaceX={3} width="full" justify="space-between">
              <HStack spaceX={2}>
                {/* Back Button (Acts as Close Trigger) */}
                <Drawer.CloseTrigger asChild>
                  <IconButton 
                    variant="ghost" 
                    size="sm" 
                    aria-label="Back to chat"
                  >
                    <FiArrowLeft size={18} />
                  </IconButton>
                </Drawer.CloseTrigger>
                
                <Drawer.Title fontSize="lg" fontWeight="semibold" fontFamily="Work sans">
                  User Profile
                </Drawer.Title>
              </HStack>

            </HStack>
          </Drawer.Header>

          <Drawer.Body py={6} overflowY="auto" flex="1">
            <VStack spaceY={6} align="stretch">
              
              {/* User Identity Section */}
              <VStack spaceY={4} align="center" textAlign="center" py={4}>
                {user?.pic && !user.pic.includes("icon-library.com") ? (
                  <Image
                    borderRadius="full"
                    boxSize="120px"
                    src={user.pic}
                    alt={user.name || "Profile"}
                    objectFit="cover"
                  />
                ) : (
                  <Box 
                    boxSize="24" 
                    borderRadius="full" 
                    bg="colorPalette.subtle" 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="center"
                    fontSize="4xl"
                    fontWeight="bold"
                    color="colorPalette.fg"
                    fontFamily="Work sans"
                  >
                    {user?.name?.[0] || "?"}
                  </Box>
                )}
                
                <VStack spaceY={0.5}>
                  <Text fontSize="2xl" fontWeight="bold" fontFamily="Work sans" color="fg.default">
                    {user?.name || "Profile"}
                  </Text>
                  <Text fontSize="sm" color="fg.muted">
                    Active Member
                  </Text>
                </VStack>
              </VStack>

              <Separator />

              {/* Information Section */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" uppercase tracking="wider" color="fg.muted" mb={3}>
                  Contact Information
                </Text>
                <Grid templateColumns="1fr" spaceY={4}>
                  <HStack spaceX={3}>
                    <Box color="fg.muted" display="flex" alignItems="center"><FiMail size={16} /></Box>
                    <Box>
                      <Text fontSize="xs" color="fg.muted">Email Address</Text>
                      <Text fontSize="md" fontWeight="medium" fontFamily="Work sans">
                        {user?.email || "No email available"}
                      </Text>
                    </Box>
                  </HStack>
                </Grid>
              </Box>

              <Separator />

              {/* Shared Files Section */}
              <Box>
                <Text fontSize="xs" fontWeight="bold" uppercase tracking="wider" color="fg.muted" mb={3}>
                  Shared Files ({user?.files?.length || 0})
                </Text>
                <VStack spaceY={2} align="stretch">
                  {user?.files?.map((file, index) => (
                    <HStack 
                      key={index} 
                      justify="space-between" 
                      p={3} 
                      borderWidth="1px" 
                      borderRadius="md" 
                      bg="bg.muted"
                      _hover={{ bg: "bg.emphasized" }}
                      transition="background 0.2s"
                    >
                      <HStack spaceX={3} overflow="hidden">
                        <Box color="blue.500" display="flex" alignItems="center"><FiFileText size={16} /></Box>
                        <Box overflow="hidden">
                          <Text fontSize="sm" fontWeight="medium" isTruncated>
                            {file.name}
                          </Text>
                          <Text fontSize="xs" color="fg.muted">
                            {file.size}
                          </Text>
                        </Box>
                      </HStack>
                      <a href={file.url} download style={{ textDecoration: 'none' }}>
                        <Button size="xs" variant="ghost" aria-label="Download file">
                          <FiDownload size={14} />
                        </Button>
                      </a>
                    </HStack>
                  ))}
                  {(!user?.files || user.files.length === 0) && (
                    <Text fontSize="sm" color="fg.muted" italic>
                      No files shared yet.
                    </Text>
                  )}
                </VStack>
              </Box>

            </VStack>
          </Drawer.Body>

          {/* Footer Action Area */}
          <Drawer.Footer borderTopWidth="1px" p={4} marginTop="auto">
            <Button variant="outline" width="full" onClick={closeDrawer}>
              Close Panel
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ProfileModal;






