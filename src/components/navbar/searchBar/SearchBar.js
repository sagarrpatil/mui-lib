import React, { useEffect, useState } from 'react';
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  List,
  ListItem,
  Box,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { fetchAvailableProduct } from '../../../service/apiservice';

export function SearchBar(props) {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProduct] = useState([]);
  useEffect(() => {
    fetchAvailableProduct().then((response) => {
      setProduct(response.filter((x) => x.quantity > 0));
    });
  }, []);
  // Handle input change and filter suggestions
  const onChange = (e) => {
    const userInput = e.target.value;

    // Filter the products based on input value
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(userInput.toLowerCase()),
    );

    setInputValue(userInput);
    setFilteredSuggestions(filtered);
    setShowSuggestions(userInput.length > 0);
  };

  // Handle click on a suggestion
  const onClick = (suggestion) => {
    setInputValue(suggestion.name);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  // Color and styles
  const { variant, background, placeholder, borderRadius, ...rest } = props;
  const searchIconColor = useColorModeValue('gray.700', 'white');
  const inputBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const inputText = useColorModeValue('gray.700', 'gray.100');

  useEffect(() => {
    if (props.fromSellOrder) {
      props.filteredSuggestionstoSell(filteredSuggestions);
    }
  }, [filteredSuggestions]);

  return (
    <Box position="relative" w="100%">
      <InputGroup w={{ base: '100%', md: '200px' }} {...rest}>
        <InputLeftElement
          children={
            <IconButton
              bg="inherit"
              borderRadius="inherit"
              _hover="none"
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{
                boxShadow: 'none',
              }}
              icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
            />
          }
        />
        <Input
          value={inputValue}
          onChange={onChange}
          variant="search"
          fontSize="sm"
          bg={
            !props.fromSellOrder ? (background ? background : inputBg) : '#fff'
          }
          color={!props.fromSellOrder ? inputText : 'black'}
          fontWeight="500"
          _placeholder={{ color: 'gray.400', fontSize: '14px' }}
          borderRadius={borderRadius ? borderRadius : '30px'}
          placeholder={placeholder ? placeholder : 'Search Product'}
        />
      </InputGroup>

      {/* Render suggestions below the input */}
      {!props.fromSellOrder &&
        showSuggestions &&
        filteredSuggestions.length > 0 && (
          <List
            bg="white"
            borderRadius="md"
            boxShadow="md"
            position="absolute"
            zIndex="1000"
            width="100%"
            mt="2"
          >
            {filteredSuggestions.map((suggestion) => (
              <ListItem
                key={suggestion.id}
                padding="10px"
                borderBottom="1px solid #ddd"
                cursor="pointer"
                _hover={{ backgroundColor: 'gray.100' }}
                onClick={() => onClick(suggestion)}
              >
                {suggestion.name}
              </ListItem>
            ))}
          </List>
        )}
    </Box>
  );
}
