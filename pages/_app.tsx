import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Container, SSRProvider } from "react-bootstrap";
import Heading from "../components/shared/Heading";
import Footer from "../components/shared/Footer";
import { Provider } from "../context";
import { ToastProvider } from "react-toast-notifications";
import TopHead from "../components/shared/TopHead";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <SSRProvider>
        <Heading />
        <Container>
          <ToastProvider>
            <NextNProgress />
            <TopHead />
            <Component {...pageProps} />
            <Footer />
          </ToastProvider>
        </Container>
      </SSRProvider>
    </Provider>
  );
}

export default MyApp;
