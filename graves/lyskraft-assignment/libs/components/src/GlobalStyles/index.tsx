import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import { CssReset } from './cssReset';
import { Fonts } from './fonts';

interface IGlobalStylesProps {
  children: React.ReactNode;
}

const theme = createTheme({
  fontFamily: 'Montserrat',
  headings: { fontFamily: 'Lora' },
  defaultRadius: 'md',
});

export const GlobalStylesProvider = ({ children }: IGlobalStylesProps) => (
  <MantineProvider theme={theme}>
    <CssReset />
    <Fonts />
    <div
      style={{
        fontFamily: 'var(--mantine-font-family)',
      }}
    >
      {children}
    </div>
  </MantineProvider>
);
