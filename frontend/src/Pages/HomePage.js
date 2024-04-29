import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Container,Box,Tab,Tabs,TabList,TabPanel,TabPanels } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
const HomePage = () => {
  const navigate=useNavigate();
useEffect(()=>{
  const user= JSON.parse(localStorage.getItem('userInfo'));
    if(user)
    {
        navigate('/');
    }
},[navigate])
  return (
   <Container maxW='xl' centerContent>
<Box w='100%' bg='white' mt={10} p={1.5} borderRadius='lg' borderWidth='1px' >
<Tabs variant='soft-rounded' colorScheme='green'>
  <TabList mb='0rem'>
    <Tab width='50%' >Login</Tab>
    <Tab width='50%'>Sign up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
       <Login/>
    </TabPanel>
    <TabPanel>
       <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>
</Box>
   </Container>
  )
}

export default HomePage
