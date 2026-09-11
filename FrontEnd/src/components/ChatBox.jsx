import React, { Suspense } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'

const SingleChat = React.lazy(() => import('./SingleChat'));

const ChatBox = ( {fetchAgain , setFetchAgain} ) => {

  const { selectedChat } = ChatState();
   
  return (
    <Box 
    display={{ base: selectedChat ? "flex" : "none", md: "flex"}}
    alignItems="center"
    flexDirection="column"
    p={3}
    bg="white"
    width={{ base: "100%", md: "68%" }}
    borderRadius="lg"
    borderWidth="1px"
    >
      <Suspense fallback={<Box p={3}>Loading chat...</Box>}>
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain }/>
      </Suspense>
    </Box>
  )
}

export default ChatBox