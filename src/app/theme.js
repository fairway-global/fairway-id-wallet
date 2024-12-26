import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light", // Or "dark"
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

export default theme;
