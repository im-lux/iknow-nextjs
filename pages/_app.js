import { SessionProvider } from "next-auth/react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.scss";
import "swiper/css";
import { useRouter } from "next/router";
import Layout from "../components/layout/layout";
import CircleMenu from "../components/ui/circle-menu";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const { pathname } = useRouter();

  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />

        {pathname !== "/" && <CircleMenu isMenu={true} inCorner={true} />}
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
