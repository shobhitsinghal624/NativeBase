import React from 'react';
import { Badge, HStack, Button } from 'native-base';

export default function () {
  return (
    <HStack>
      <Button colorScheme="teal" endIcon={<Badge ml={2}>10</Badge>}>
        Notifications
      </Button>
    </HStack>
  );
}