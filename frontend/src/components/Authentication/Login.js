import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const SubmitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
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
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const {data} = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "LogIn Successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
        position:"top-right"
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chat");
    } catch (err) {
      console.log(err);
      toast({
        title: "Invalid Credentials",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top-right",
      });
      setLoading(false);
      return;
    }
  };
  return (
    <VStack spacing="12px">
      <FormControl id="emailId" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Email-id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="passwordAuth" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="green"
        width="100%"
        style={{ marginTop: 40 }}
        isLoading={loading}
        onClick={SubmitHandler}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        mt={2}
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("guest");
        }}
      >
        Guest Login
      </Button>
    </VStack>
  );
};

export default Login;
