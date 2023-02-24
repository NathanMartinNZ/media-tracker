import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import AuthenticatedLayout from "../components/AuthenticatedLayout";

import { api } from "../utils/api";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <SessionProvider session={session}>
        <AuthenticatedLayout>
          <Component {...pageProps} />
        </AuthenticatedLayout>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
