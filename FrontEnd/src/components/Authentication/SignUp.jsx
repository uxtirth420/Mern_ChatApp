import React, {useState} from 'react';
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



const toaster = createToaster({ placement: 'top' });
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const SignUp = () => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

   const handlePasswordClick = () => setShowPassword(!showPassword);
   const handleConfirmPasswordClick = () => setShowConfirmPassword(!showConfirmPassword);
   

   const postDetails = (pics) => {
      //  setLoading(true);
       if(!pics) {
           toaster.create({
                title: "Please Select an image!",
                type: "warning",
                duration: 5000,
                closable: true,
            });  
           return;
       }

       if(pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name","f6td3ksi");
        fetch("https://api.cloudinary.com/v1_1/f6td3ksi/image/upload", {
          method: 'post',
          body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Cloudinary response:", data);
              if (data.secure_url || data.url) {
                 setPic((data.secure_url || data.url).toString());
              }
              // setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
       }    else {
              toaster.create({
                title: "Please Select an image!",
                type: "warning",
                duration: 5000,
                closable: true,
            });  
       }
  };

   const submitHandler = async () => {
    // Basic validation checks triggering toasts
    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Please Fill all the Fields",
        type: "warning",
        duration: 5000,
        closable: true,
      });
      return;
    }

    if (password !== confirmpassword) {
      toaster.create({
        title: "Passwords Do Not Match",
        type: "warning",
        duration: 5000,
        closable: true,
      });
      return;
    }
     try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(`${BACKEND_URL}/api/user`, {name, email, password, pic},
        config
      );

      toaster.create({
        title: "Registration Successful, Please Login!",
        type: "success",
        duration: 5000,
        closable: true,
      });

      setLoading(false);
     }catch(error) {
       toaster.create({
        title: "Error Occured!",
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
        <Field.Root id="name" required>
         <Field.Label>Name</Field.Label>
         <Input
           placeholder="Enter Your Name"
           value={name}
           onChange={(e)=>setName(e.target.value)}
         />
        </Field.Root>

        <Field.Root id="email" required>
         <Field.Label>Email</Field.Label>
         <Input
           placeholder="Enter Your Email"
           value={email}
           onChange={(e)=>setEmail(e.target.value)}
           required
         />
        </Field.Root>

      <Field.Root id="password" required>
        <Field.Label>Password</Field.Label>
        <InputGroup
          endElement={
            <InputElement placement="end" style={{ width: "4.5rem" }}>
              <Button
                h="1.75rem"
                size="sm"
                onClick={handlePasswordClick}
                color="black"
                colorPalette="blue"
                bg="colorPalette.100/80"
              >
                {showPassword ? "Hide" : "Show"}
              </Button>
            </InputElement>
          }
        >
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </Field.Root> 

      <Field.Root id="confirm-password" required>
        <Field.Label>Confirm Password</Field.Label>
        <InputGroup
          endElement={
            <InputElement placement="end" style={{ width: "4.5rem" }}>
              <Button
                h="1.75rem"
                size="sm"
                onClick={handleConfirmPasswordClick}
                color="black"
                colorPalette="blue"
                bg="colorPalette.100/80"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </Button>
            </InputElement>
          }
        >
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Enter Your Password"
            value={confirmpassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </InputGroup>
      </Field.Root>

          <Field.Root id="pic">
            <Field.Label>Upload you Picture</Field.Label>
            <Input
              type="file"
              p={1.5}
              accept="image/*"
              onChange={(e)=> postDetails(e.target.files[0])}
            />
          </Field.Root>

        <Button
        colorPalette="blue"
        bg="colorPalette.500/80"
        width="100%"
        mt={4}
        onClick={submitHandler}
        _hover={{
              transform: "translateY(-2px)",
              transition: "all 0.2s ease-in-out" }}
        loading={loading}
        >
          Sign Up
        </Button>
    </VStack>
  </>
  )
}

export default SignUp