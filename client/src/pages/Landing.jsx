import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export default function Landing() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#080b10', color: '#e6edf3', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(8,11,16,.92)', borderBottom: '0.5px solid #21262d',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Syne', sans-serif", fontSize: '17px', fontWeight: 700, color: '#e6edf3' }}>
          <div style={{
            width: '28px', height: '28px', background: '#4f8cff',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', color: '#fff', fontWeight: 800
          }}>D</div>
          DevHive
          <span style={{ fontSize: '10px', color: '#7d8590', fontFamily: 'monospace', marginLeft: '2px' }}>v1.0</span>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Features', 'AI Fairness', 'GitHub', 'Pricing'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
              style={{ fontSize: '13px', color: '#7d8590', textDecoration: 'none' }}>
              {item}
            </a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link to="/login" style={{
            padding: '6px 16px', borderRadius: '5px', fontSize: '13px',
            color: '#c9d1d9', border: '0.5px solid #2d3748', background: 'transparent',
            textDecoration: 'none', transition: 'all .2s'
          }}>Sign in</Link>
          <Link to="/register" style={{
            padding: '7px 20px', borderRadius: '5px', fontSize: '13px',
            color: '#fff', background: '#4f8cff', textDecoration: 'none', fontWeight: 500
          }}>Get early access</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 40px 80px', position: 'relative', textAlign: 'center'
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(33,38,45,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(33,38,45,.5) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%,black,transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%,black,transparent)'
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse,rgba(79,140,255,.08) 0%,transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '4px 12px', borderRadius: '20px',
            background: 'rgba(34,197,94,.06)', border: '0.5px solid rgba(34,197,94,.15)',
            fontSize: '11px', color: '#22c55e', fontFamily: 'monospace', marginBottom: '24px'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Real-time engine online · v1.0 preview
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px,5vw,68px)',
            fontWeight: 800, lineHeight: 1.04, letterSpacing: '-2px', marginBottom: '20px'
          }}>
            <span style={{ display: 'block', color: '#e6edf3' }}>The operating system</span>
            <span style={{ display: 'block', background: 'linear-gradient(120deg,#4f8cff,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              for engineering teams.
            </span>
          </h1>

          <p style={{ fontSize: '16px', color: '#7d8590', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 32px', fontWeight: 300 }}>
            DevHive unifies tasks, GitHub activity, sprint execution, and <b style={{ color: '#c9d1d9', fontWeight: 400 }}>AI workload intelligence</b> into one real-time workspace.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px', borderRadius: '7px', background: '#4f8cff',
              color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none'
            }}>Get early access →</Link>
            <a href="#features" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '7px', background: 'transparent',
              color: '#c9d1d9', fontSize: '14px', border: '0.5px solid #2d3748', textDecoration: 'none'
            }}>See features</a>
          </div>

          {/* Pills */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['⚡ Real-time sync', '🐙 GitHub native', '🧠 AI workload engine', '🚀 Sprint planning'].map(p => (
              <div key={p} style={{ fontSize: '12px', color: '#4a5568', fontFamily: 'monospace' }}>{p}</div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: '#0d1117', borderTop: '0.5px solid #21262d', borderBottom: '0.5px solid #21262d', padding: '14px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 28s linear infinite' }}>
          {[...Array(2)].map((_, ri) => (
            ['Real-time Sync','AI Workload Engine','GitHub Webhooks','Sprint Planning','BullMQ Queues','Redis Pub/Sub','Socket.io Rooms','Kanban Board','Hive Board','Role-based Access'].map((item, i) => (
              <div key={`${ri}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0 22px', fontSize: '11px', color: '#4a5568', fontFamily: 'monospace', whiteSpace: 'nowrap', borderRight: '0.5px solid #21262d' }}>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#4f8cff', display: 'inline-block' }} />
                {item}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section id="features" style={{ background: '#0d1117', padding: '88px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#4f8cff', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '10px' }}>// The Problem</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,3vw,42px)', fontWeight: 700, letterSpacing: '-1.5px', marginBottom: '12px' }}>
              Most teams don't fail because of code.
            </h2>
            <p style={{ fontSize: '15px', color: '#7d8590', maxWidth: '460px', margin: '0 auto' }}>
              They fail because work becomes invisible. One person burns out. Deadlines slip. No one saw it coming.
            </p>
          </div>

          {/* Compare Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Without */}
            <div style={{ background: '#080b10', border: '0.5px solid rgba(239,68,68,.15)', borderRadius: '10px', padding: '26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', fontSize: '14px', fontWeight: 600, color: '#ef4444' }}>
                ❌ Without DevHive
              </div>
              {['Tasks in Trello / Jira', 'Code in GitHub', 'Chats in Slack / WhatsApp', 'Notes in Docs / Notion', 'No workload visibility'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: '#c9d1d9', marginBottom: '10px' }}>
                  <span>→</span>{item}
                </div>
              ))}
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid #21262d', fontSize: '11px', color: 'rgba(239,68,68,.6)', fontFamily: 'monospace' }}>
                // Context switching. Confusion. Burnout.
              </div>
            </div>
            {/* With */}
            <div style={{ background: '#080b10', border: '0.5px solid rgba(79,140,255,.15)', borderRadius: '10px', padding: '26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', fontSize: '14px', fontWeight: 600, color: '#4f8cff' }}>
                ✅ With DevHive
              </div>
              {['Everything in one workspace', 'Real-time collaboration', 'AI workload intelligence', 'GitHub automation', 'Healthy team balance'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: '#c9d1d9', marginBottom: '10px' }}>
                  <span style={{ color: '#22c55e' }}>✓</span>{item}
                </div>
              ))}
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '0.5px solid #21262d', fontSize: '11px', color: '#4f8cff', fontFamily: 'monospace' }}>
                // Focused teams. Balanced workload. On-time delivery.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: '#080b10', padding: '88px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#4f8cff', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: '10px' }}>// Features</div>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(26px,3vw,42px)', fontWeight: 700, letterSpacing: '-1.5px' }}>
              Everything your team needs.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: '#21262d', border: '0.5px solid #21262d', borderRadius: '10px', overflow: 'hidden' }}>
            {[
              { icon: '⚡', title: 'Real-time Kanban', desc: 'Drag tasks, sync instantly across all members via Socket.io room-scoped events.', tag: 'socket.io' },
              { icon: '🧠', title: 'AI Workload Engine', desc: 'Detects imbalance before burnout. Fires alerts and suggests reassignments automatically.', tag: 'core feature ★' },
              { icon: '🐙', title: 'GitHub Integration', desc: 'Link PRs to tasks. Merge a PR — task closes itself. Commit heatmaps per member.', tag: 'webhooks' },
              { icon: '🚀', title: 'Sprint Planning', desc: 'Time-boxed sprints with velocity charts. BullMQ keeps workload data fresh every 30 min.', tag: 'analytics' },
              { icon: '✍️', title: 'NLP Task Creation', desc: 'Type naturally — AI parses it into a structured task with assignee, priority, and deadline.', tag: 'groq ai' },
              { icon: '⬡', title: 'Hive Board', desc: 'Post a project idea, find the right teammates, build together from day zero.', tag: 'unique' },
            ].map((f) => (
              <div key={f.title} style={{ background: '#080b10', padding: '26px', transition: 'background .3s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#161b22'}
                onMouseLeave={e => e.currentTarget.style.background = '#080b10'}
              >
                <div style={{ fontSize: '20px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{f.title}</div>
                <div style={{ fontSize: '13px', color: '#7d8590', lineHeight: 1.7 }}>{f.desc}</div>
                <div style={{ marginTop: '10px', display: 'inline-block', fontSize: '9px', fontFamily: 'monospace', padding: '2px 7px', borderRadius: '3px', background: 'rgba(79,140,255,.08)', color: '#4f8cff', border: '0.5px solid rgba(79,140,255,.2)' }}>{f.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0d1117', borderTop: '0.5px solid #21262d', textAlign: 'center', padding: '88px 40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '200px', background: 'radial-gradient(ellipse,rgba(79,140,255,.07),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(28px,3.5vw,48px)', fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '14px' }}>
            Stop juggling five tools.<br />Start shipping together.
          </h2>
          <p style={{ fontSize: '15px', color: '#7d8590', marginBottom: '28px', lineHeight: 1.7, fontWeight: 300 }}>
            Spin up your first project room in under a minute. Free during preview.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 28px', borderRadius: '7px', background: '#4f8cff', color: '#fff', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
              Get started free →
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '12px 20px', borderRadius: '7px', background: 'transparent', color: '#c9d1d9', fontSize: '14px', border: '0.5px solid #2d3748', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
          <div style={{ fontSize: '10px', color: '#4a5568', fontFamily: 'monospace' }}>
            // No credit card · Open source · MIT License
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#080b10', borderTop: '0.5px solid #21262d', padding: '40px 48px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '36px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: 700 }}>
                <div style={{ width: '24px', height: '24px', background: '#4f8cff', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 800 }}>D</div>
                DevHive
              </div>
              <p style={{ fontSize: '12px', color: '#7d8590', lineHeight: 1.7, maxWidth: '200px' }}>
                Engineering Mission Control for teams who build serious software.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'AI Fairness', 'GitHub Integration', 'Hive Board', 'Pricing'] },
              { title: 'Resources', links: ['Docs', 'API Reference', 'Changelog', 'Self-hosting', 'GitHub'] },
              { title: 'Company', links: ['About', 'Blog', 'Privacy', 'Terms', 'Contact'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: '10px', color: '#e6edf3', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '12px', fontFamily: "'Syne',sans-serif" }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ fontSize: '12px', color: '#7d8590', marginBottom: '7px', cursor: 'pointer' }}>{link}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '20px', borderTop: '0.5px solid #21262d' }}>
            <div style={{ fontSize: '10px', color: '#4a5568', fontFamily: 'monospace' }}>© 2026 DevHive — MIT License</div>
            <div style={{ fontSize: '10px', color: '#4a5568', fontFamily: 'monospace' }}>Built with ♥ by a developer, for developers.</div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.3 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #080b10; }
        ::-webkit-scrollbar-thumb { background: #21262d; border-radius: 2px; }
      `}</style>
    </div>
  )
}