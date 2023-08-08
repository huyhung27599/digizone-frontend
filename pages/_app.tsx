import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Container, SSRProvider } from "react-bootstrap";
import Heading from "../components/shared/Heading";
import Footer from "../components/shared/Footer";
import { Provider } from "../context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <SSRProvider>
        <Heading />
        <Container>
          <Component {...pageProps} />
          <Footer />
        </Container>
      </SSRProvider>
    </Provider>
  );
}

export default MyApp;
