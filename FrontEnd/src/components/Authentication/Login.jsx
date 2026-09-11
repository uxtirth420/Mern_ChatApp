import { useState } from 'react';
import {
  Field,
  Input,
  InputGroup,
  InputElement,
  VStack,
  Button,
  Toaster,
  Toast,
  createToaster,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';



const toaster = createToaster({ placement: 'top' });
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Login = () => {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = ChatState();

    const handleClick = () => setShow(!show);
    const submitHandler = async () => {
      // Basic validation checks triggering toasts
          if ( !email || !password ) {
            toaster.create({
              title: "Please Fill all the Fields",
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
                "Content-type": "application/json",
              },
            };
      
            const { data } = await axios.post(`${BACKEND_URL}/api/user/login`, { email, password },
              config
            );
      
            setLoading(false);

            toaster.create({
              title: "Login Successful!",
              type: "success",
              duration: 1500,
              closable: true,
            });
      
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
      
            setTimeout(() => navigate('/chats'), 1500);
           }catch(error) {
             const errorMessage = error.response?.data?.message || "Unable to connect to the server";

             toaster.create({
              title: "Login Failed",
              description: errorMessage,
              type: "error",
              duration: 5000,
              closable: true,
            });
            setLoading(false);
           }
         }

    return (
    <>
      <Toaster toaster={toaster}>
              {(toast) => (
                <Toast.Root key={toast.id} type={toast.type}>
                  <Toast.Title>{toast.title}</Toast.Title>
                </Toast.Root>
              )}
          </Toaster>
      <VStack spacing={4}>
                <Field.Root id="email" required>
                 <Field.Label>Email</Field.Label>
                 <Input
                   placeholder="Enter Your Email"
                   value={email}
                   onChange={(e)=>setEmail(e.target.value)}
                 />
                 <Field.ErrorText>This field is required</Field.ErrorText>
                </Field.Root>
        
                <Field.Root id="password" required>
                  <Field.Label>Password</Field.Label>
                        <InputGroup
                          endElement={
                            <InputElement placement="end" style={{ width: "4.5rem" }}>
                              <Button h="1.75rem" size="sm" onClick={handleClick} color="black" colorPalette="blue" bg="colorPalette.100/80">
                                {show ? "Hide" : "Show"}
                              </Button>
                            </InputElement>
                          }
                        >
                            <Input
                              type={show ? "text" : "password"}
                              placeholder="Enter Your Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                        </InputGroup>
                        <Field.ErrorText>This field is required</Field.ErrorText>
                </Field.Root>

            <Button
              colorPalette="blue"
              bg="colorPalette.500/80"
              width="100%"
              color="white"
              mt={4}
              onClick={submitHandler}
              _hover={{
              transform: "translateY(-2px)",
              transition: "all 0.2s ease-in-out" }}
              loading={loading}
            >
              Login
            </Button>
            <Button
              variant="solid"
              colorPalette="red"
              bg="colorPalette.500/80"
              width="100%"
              mt={2}
              _hover={{
              transform: "translateY(-2px)",
              transition: "all 0.2s ease-in-out" }}
              onClick={() => {
              setEmail("guest@example.com")
              setPassword("123456")
              }}
            >
              Get Guest User Credentials
            </Button>
      </VStack>
    </> 
  )
}

export default Login;