import { useSession } from "next-auth/react";
import SignIn from "../components/SignIn";
import Loading from "./Loading";
import SignOut from "./SignOut";

const AuthenticatedLayout = ({ children }: React.PropsWithChildren) => {
  const { data: session, status } = useSession();

  if (!status || status === "loading") {
    return <Loading />;
  }
  if (status === "unauthenticated") {
    return <SignIn />;
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center bg-gradient-to-r from-[#2e026d] to-[#15162c]">
      <div className="absolute right-0">
        <SignOut />
      </div>
      <div className="lg:w-4/6">{children}</div>
    </div>
  );
};

export default AuthenticatedLayout;
