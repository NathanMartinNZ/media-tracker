import { signIn } from "next-auth/react"

const SignIn = () => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="lg:w-4/6">
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    </div>
  )
}

export default SignIn