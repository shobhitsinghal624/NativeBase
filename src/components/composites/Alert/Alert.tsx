import React from 'react';
import Box from '../../primitives/Box';
import HStack from '../../primitives/Stack/HStack';
import { usePropsResolution } from '../../../hooks/useThemeProps';
import type { IAlertProps } from './types';
import { AlertContext } from './Context';

const Alert = (
  { children, _text, action, actionProps, ...props }: IAlertProps,
  ref?: any
) => {
  const {
    status,
    variant,
    iconColor,
    colorScheme,
    _actionProps,
    ...newProps
  } = usePropsResolution('Alert', props);

  return (
    <AlertContext.Provider
      value={{
        status,
        variant,
        iconColor,
        colorScheme,
      }}
    >
      <HStack _text={_text} {...newProps} ref={ref} space={2}>
        {children}
        {action ? (
          <Box {..._actionProps} {...actionProps}>
            {action}
          </Box>
        ) : null}
      </HStack>
    </AlertContext.Provider>
  );
};

export default React.memo(React.forwardRef(Alert));