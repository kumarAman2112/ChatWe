import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [pic, setPic] = useState("");
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const postPicHandler =async (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Image is not selected",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    if (
      pics.type === "image/jpeg" ||
      pics.type === "image/png" ||
      pics.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "amankumar");
      const res=await axios.post("https://api.cloudinary.com/v1_1/amankumar/image/upload",data);
      console.log(res);
      console.log(res.data.url);
      setPic(res.data.url);
      setLoading(false);
    } else {
      toast({
        title: "Invalid file format",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  };
  const SubmitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Fields cannot be empty",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const {data}= await axios.post(
        "/api/user/signup",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Successfully Registered",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
   
  };
  return (
    <VStack spacing="2px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>

        <Input
          placeholder="Email-id"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm" isRequired>
        <FormLabel>ConfirmPassword</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="confirmPassword"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          placeholder="profilePic"
          onChange={(e) => postPicHandler(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="green"
        width="100%"
        style={{ marginTop: 10 }}
        isLoading={loading}
        onClick={SubmitHandler}
      >
        Sign up
      </Button>
    </VStack>
  );
};

export default Signup;
