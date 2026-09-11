import React, { Suspense, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react';

const ChatBox = React.lazy(() => import('../components/ChatBox'))
const MyChats = React.lazy(() => import('../components/MyChats'))
const SideDrawer = React.lazy(() => import('../components/miscellaneous/SideDrawer'))

const Chatpage = () => {

  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%"}}>
      <Suspense fallback={<div style={{ padding: '10px' }}>Loading chat tools...</div>}>
        {user && <SideDrawer />}
      </Suspense>
      <Box
      display="flex"
      justifyContent='space-between'
      w='100%'
      h='91.5vh'
      p='10px'
      >
        <Suspense fallback={<Box w='30%' p={3}>Loading chats...</Box>}>
          {user && (
            <MyChats fetchAgain={fetchAgain} />
          )}
        </Suspense>
        <Suspense fallback={<Box w='68%' p={3}>Loading chat box...</Box>}>
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Suspense>
      </Box>
      
    </div>
  )
}

export default Chatpage