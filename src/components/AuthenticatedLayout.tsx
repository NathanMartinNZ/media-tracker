import { useSession } from "next-auth/react";
import SignIn from "../components/SignIn";

const AuthenticatedLayout = ({ children }:React.PropsWithChildren) => {
  const { data: session } = useSession()
  if(!session) { return <SignIn />}

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="lg:w-4/6">{children}</div>
    </div>
  )
}

export default AuthenticatedLayout
