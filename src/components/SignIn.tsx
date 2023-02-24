import { signIn } from "next-auth/react";
import Head from "next/head";

const SignIn = () => {
  return (
    <>
      <Head>
        <title>Media Tracker</title>
        <meta name="description" content="Personal media tracker app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="lg:w-4/6">
          <main className="flex h-fit flex-col items-center">
            <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
                <span className="text-[hsl(280,100%,70%)]">Media</span> Tracker
              </h1>
              <div className="flex gap-4 p-4">
                <button
                  onClick={() => signIn("google")}
                  className="btn-primary btn py-4"
                >
                  Sign in with Google
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default SignIn;
