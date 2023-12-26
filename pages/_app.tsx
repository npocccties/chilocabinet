import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/styles/chakraTheme";
import { RecoilRoot, RecoilEnv } from "recoil";

import type { AppProps } from "next/app";

// MEMO: 開発環境でのAtomキーの重複エラーを非表示
// https://recoiljs.org/blog/2022/10/11/recoil-0.7.6-release/
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default MyApp;
