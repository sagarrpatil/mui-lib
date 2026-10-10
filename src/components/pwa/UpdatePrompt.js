import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  Icon,
  Image,
  Slide,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdSystemUpdateAlt } from 'react-icons/md';
import { applyUpdate } from 'pwa';

export default function UpdatePrompt() {
  const [registration, setRegistration] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const bg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    const show = (reg) => {
      setRegistration(reg);
      setDismissed(false);
    };
    const onUpdate = (e) => show(e.detail);
    window.addEventListener('pwa-update-available', onUpdate);

    // The app can render after registerPWA already announced an update, so
    // also inspect the registration directly once mounted.
    let reg;
    const onFound = () => {
      const worker = reg.installing;
      if (!worker) return;
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller)
          show(reg);
      });
    };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((r) => {
        if (!r) return;
        reg = r;
        if (r.waiting && navigator.serviceWorker.controller) show(r);
        r.addEventListener('updatefound', onFound);
      });
    }
    return () => {
      window.removeEventListener('pwa-update-available', onUpdate);
      if (reg) reg.removeEventListener('updatefound', onFound);
    };
  }, []);

  const open = Boolean(registration) && !dismissed;

  return (
    <Slide direction="bottom" in={open} style={{ zIndex: 2100 }}>
      <Flex justify="center" p="16px" pointerEvents="none">
        <Flex
          role="status"
          aria-live="polite"
          pointerEvents="auto"
          bg={bg}
          borderRadius="20px"
          boxShadow="0 20px 50px -12px rgba(15, 23, 42, 0.35)"
          p="14px"
          gap="12px"
          align="center"
          w="100%"
          maxW="460px"
          direction={{ base: 'column', sm: 'row' }}
        >
          <Flex align="center" gap="12px" flex="1" w="100%">
            <Image
              src={`${process.env.PUBLIC_URL}/icons/icon-192.png`}
              alt=""
              w="44px"
              h="44px"
              borderRadius="12px"
            />
            <Flex direction="column" minW="0">
              <Text color={textColor} fontWeight="700" fontSize="sm">
                New version available
              </Text>
              <Text color="secondaryGray.600" fontSize="xs">
                Update now to get the latest changes.
              </Text>
            </Flex>
          </Flex>
          <Flex gap="8px" w={{ base: '100%', sm: 'auto' }}>
            <Button
              size="sm"
              variant="ghost"
              flex={{ base: 1, sm: 'none' }}
              onClick={() => setDismissed(true)}
            >
              Later
            </Button>
            <Button
              size="sm"
              variant="brand"
              flex={{ base: 1, sm: 'none' }}
              leftIcon={<Icon as={MdSystemUpdateAlt} />}
              isLoading={updating}
              loadingText="Updating"
              onClick={() => {
                setUpdating(true);
                applyUpdate(registration);
              }}
            >
              Update
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Slide>
  );
}
