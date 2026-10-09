import React, { useState } from 'react';
// Chakra imports
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import DefaultAuth from 'layouts/auth/Default';
// Assets
import illustration from 'assets/img/auth/auth.png';
import {
  MdOutlineRemoveRedEye,
  MdOutlineEmail,
  MdLockOutline,
} from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { auth } from '../../../firebase';
import { signInWithEmailAndPassword } from '@firebase/auth';

function SignIn() {
  // Chakra color mode
  const [username, serUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password,
      );
      const user = userCredential.user;
      localStorage.setItem('token', btoa(encodeURI(user.email)));
      window.location.href = '/';
    } catch (error) {
      setError('Invalid credentials. Please check your email and password.');
      setIsLoading(false);
    }
  };
  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Box w="100%" maxW="420px" mx={{ base: 'auto', lg: '0' }} py="40px">
        <Heading
          color={textColor}
          fontSize={{ base: '32px', md: '36px' }}
          mb="8px"
        >
          Welcome back
        </Heading>
        <Text mb="32px" color={textColorSecondary} fontSize="md">
          Enter your email and password to sign in.
        </Text>

        {error && (
          <Alert status="error" borderRadius="12px" mb="24px" fontSize="sm">
            <AlertIcon />
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl isRequired mb="20px">
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
              requiredIndicator={
                <Text as="span" color={brandStars} ms="2px">
                  *
                </Text>
              }
            >
              Email
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={MdOutlineEmail} color={textColorSecondary} />
              </InputLeftElement>
              <Input
                variant="auth"
                fontSize="sm"
                type="email"
                autoComplete="email"
                value={username}
                onChange={(e) => serUsername(e.target.value)}
                placeholder="mail@example.com"
                fontWeight="500"
                ps="44px"
              />
            </InputGroup>
          </FormControl>

          <FormControl isRequired mb="28px">
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
              requiredIndicator={
                <Text as="span" color={brandStars} ms="2px">
                  *
                </Text>
              }
            >
              Password
            </FormLabel>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none" h="100%">
                <Icon as={MdLockOutline} color={textColorSecondary} />
              </InputLeftElement>
              <Input
                fontSize="sm"
                placeholder="Min. 8 characters"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? 'text' : 'password'}
                variant="auth"
                ps="44px"
              />
              <InputRightElement h="100%">
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label={show ? 'Hide password' : 'Show password'}
                  icon={
                    <Icon
                      color={textColorSecondary}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    />
                  }
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            type="submit"
            fontSize="sm"
            variant="brand"
            fontWeight="600"
            w="100%"
            h="50px"
            isLoading={isLoading}
            loadingText="Signing in"
          >
            Sign In
          </Button>
        </form>

        <Flex justify="center" mt="24px">
          <Text color={textColorSecondary} fontSize="xs">
            Having trouble signing in? Contact your administrator.
          </Text>
        </Flex>
      </Box>
    </DefaultAuth>
  );
}

export default SignIn;
