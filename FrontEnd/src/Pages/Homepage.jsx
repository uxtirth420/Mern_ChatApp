import React, {useState, useEffect} from 'react';
import {
  Container,
  Box,
  Text,
  Tabs,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { getStoredUser } from "../utils/auth";

const Homepage = () => {

    const [activeTab, setActiveTab] = useState("login");

    const navigate = useNavigate();

    
    useEffect( () => {
        const userInfo = getStoredUser();

      if(userInfo) {
           navigate("/chats");
        }
    }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
      display="flex"
      justifyContent="center"
      bg="white"
      width="100%"
      margin="40px 0 15px 0"
      borderRadius="lg"
      borderWidth="1px"
      >
      <Text fontSize="3xl" fontFamily="Inter">
         MERN CHATAPP 
      </Text>
      </Box>
      <Box bg="white" width="100%" p={4} borderRadius="lg" borderWidth="1px" color="black">
        <Tabs.Root defaultValue="login" variant="soft-rounded" colorPalette="gray">
          <Tabs.List mb={4} width="100%" >
            <Tabs.Trigger value="login" flex="1" borderRadius="25px" justifyContent="center"
              bg={activeTab === "login" ? "blue.100" : "transparent"}
              color={activeTab === "login" ? "inherit" : "black"}
              _hover={{
                bg: activeTab === "login" ? "blue.100" : "gray.200",
                color: activeTab === "login" ? "blackAlpha.300" : "inherit"
              }}
              onClick={() => setActiveTab("login")}
             >Login
            </Tabs.Trigger>

            <Tabs.Trigger value="signup" flex="1" borderRadius="25px" justifyContent="center"
              bg={activeTab === "signup" ? "blue.100" : "transparent"}
              color={activeTab === "signup" ? "inherit" : "black"}
              _hover={{
                bg: activeTab === "signup" ? "blue.100" : "gray.200",
                color: activeTab === "signup" ? "blackAlpha.300" : "inherit"
              }}
              onClick={() => setActiveTab("signup")}
             >Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.ContentGroup>
            <Tabs.Content value="login">
              <Login />
            </Tabs.Content>
            <Tabs.Content value="signup">
              <SignUp />
            </Tabs.Content>
          </Tabs.ContentGroup>
        </Tabs.Root>
      </Box>
    </Container>
  )
}

export default Homepage