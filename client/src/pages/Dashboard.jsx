export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center gap-2 justify-center mb-4">
          <div className="w-8 h-8 bg-accent flex items-center justify-center text-white font-bold text-sm"
            style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
            D
          </div>
          <span className="font-bold text-xl text-text">DevHive</span>
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">Welcome to DevHive</h1>
        <p className="text-muted text-sm font-mono">// Dashboard coming soon</p>
      </div>
    </div>
  )
}