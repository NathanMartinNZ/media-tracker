
const Layout = ({ children }:React.PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div>{children}</div>
    </div>
  )
}

export default Layout
