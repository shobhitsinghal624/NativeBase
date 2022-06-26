import React from 'react';
import { default as Box } from '../components/primitives/Box';
import type { IBoxProps } from '../components/primitives/Box';
import type { SpaceType as ThemeSpaceType } from '../components/types';
import { ResponsiveQueryContext } from './useResponsiveQuery/ResponsiveQueryProvider';

type SpaceType =
  | 'gutter'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | ThemeSpaceType;

// References:
// - https://github.com/gregberge/react-flatten-children
// - https://github.com/grrowl/react-keyed-flatten-children

type ReactChildArray = ReturnType<typeof React.Children.toArray>;
function flattenChildrenAndAddSpaces(
  children: React.ReactNode | React.ReactNode[],
  spacer: JSX.Element,
  keys: string[] = []
): ReactChildArray {
  const flatChildren: ReactChildArray = [];
  React.Children.forEach(children, (child: React.ReactNode, index: number) => {
    if (typeof child === 'undefined' || child === null) {
      return;
    }

    const newKeys = keys.concat(
      String((child as React.ReactElement<any>).key || index)
    );

    // flatten children
    if ((child as React.ReactElement<any>).type === React.Fragment) {
      flatChildren.concat(
        flattenChildrenAndAddSpaces(
          (child as React.ReactElement<any>).props.children,
          spacer,
          newKeys
        )
      );
    } else if (React.isValidElement(child)) {
      flatChildren.push(
        React.cloneElement(child, {
          key: newKeys.join('.'),
        })
      );
    } else {
      flatChildren.push(child);
    }

    // add space
    flatChildren.push(
      React.cloneElement(spacer, {
        key: `spaced-child.${newKeys.join('.')}`,
      })
    );
  });

  // one extra space got added at the end, lets remove it
  if (flatChildren.length > 1) {
    flatChildren.pop();
  }

  return flatChildren;
}

const getSpacedChildren = (
  children: React.ReactNode | React.ReactNode[],
  space: undefined | SpaceType,
  axis: 'X' | 'Y',
  reverse: string,
  divider: JSX.Element | undefined
): React.ReactNode | React.ReactNode[] => {
  if (!space && !divider) {
    return children;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const responsiveQueryContext = React.useContext(ResponsiveQueryContext);
  const disableCSSMediaQueries = responsiveQueryContext.disableCSSMediaQueries;

  if (!disableCSSMediaQueries && !divider) {
    return children;
  }

  let spacer: JSX.Element;

  // If there's a divider,
  // we wrap it with a Box and apply vertical and horizontal margins
  // else we add a spacer Box with height or width
  if (divider) {
    const orientation = axis === 'X' ? 'vertical' : 'horizontal';
    const spacingProps: IBoxProps =
      axis === 'X' ? { mx: space } : { my: space };
    spacer = React.cloneElement(divider, {
      orientation,
      ...spacingProps,
    });
  } else {
    const spacingProps: IBoxProps =
      axis === 'X' ? { width: space } : { height: space };
    spacer = <Box {...spacingProps} />;
  }

  const spacedChildren = flattenChildrenAndAddSpaces(children, spacer);

  if (reverse === 'reverse') {
    return spacedChildren.reverse();
  }
  return spacedChildren;
};

export default getSpacedChildren;
