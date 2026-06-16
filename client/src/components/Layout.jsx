import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto mt-12 md:mt-0 min-w-0">
        {children}
      </main>
    </div>
  )
}