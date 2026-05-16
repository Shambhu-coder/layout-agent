import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import WireframePreview from './components/WireframePreview';
import JsonViewer from './components/JsonViewer';
import { useLayoutAgent } from './hooks/useLayoutAgent';

function TabBtn({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:'flex',alignItems:'center',gap:6,
        padding:'7px 14px',
        borderRadius:8,
        fontSize:12.5,
        fontWeight: active ? 600 : 400,
        background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
        color: active ? 'var(--color-accent-2)' : 'var(--color-text-3)',
        border: active ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
        cursor:'pointer',
        transition:'all 0.18s',
        fontFamily:'var(--font-sans)',
      }}
      onMouseEnter={e => { if(!active) e.currentTarget.style.color='var(--color-text-2)'; }}
      onMouseLeave={e => { if(!active) e.currentTarget.style.color='var(--color-text-3)'; }}
    >
      {icon} {label}
    </button>
  );
}

function StatusPill({ count }) {
  return (
    <div style={{
      display:'inline-flex',alignItems:'center',gap:6,
      background:'rgba(34,197,94,0.1)',
      border:'1px solid rgba(34,197,94,0.25)',
      borderRadius:99,padding:'3px 10px',
      fontSize:11,color:'var(--color-green)',
      fontFamily:'var(--font-mono)',
    }}>
      <span style={{width:6,height:6,borderRadius:'50%',background:'var(--color-green)',display:'inline-block'}}/>
      {count} messages
    </div>
  );
}

export default function App() {
  const { layout, messages, loading, sendMessage, resetLayout } = useLayoutAgent();
  const [tab, setTab] = useState('preview');

  const artboard = layout.nodes[layout.rootNodes[0]];
  const msgCount = messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0).length;

  return (
    <div style={{height:'100dvh',display:'flex',flexDirection:'column',background:'var(--color-bg)',overflow:'hidden'}}>

      {/* ── Header ── */}
      <header style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'0 20px',
        height:56,
        borderBottom:'1px solid var(--color-border)',
        background:'var(--color-surface)',
        flexShrink:0,
      }}>
        {/* Brand */}
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{
            width:34,height:34,borderRadius:9,
            background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
            display:'flex',alignItems:'center',justifyContent:'center',
            boxShadow:'0 4px 12px rgba(108,99,255,0.4)',
          }}>
            <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'var(--color-text-1)',lineHeight:1.2}}>Layout Agent</div>
            <div style={{fontSize:11,color:'var(--color-text-3)',fontFamily:'var(--font-mono)'}}>
              {artboard?.name} · {artboard?.width}×{artboard?.height}px
            </div>
          </div>
        </div>

        {/* Center status */}
        <StatusPill count={msgCount} />

        {/* Reset */}
        <button
          onClick={resetLayout}
          style={{
            display:'flex',alignItems:'center',gap:6,
            fontSize:12,color:'var(--color-text-3)',
            background:'var(--color-surface-2)',
            border:'1px solid var(--color-border-2)',
            borderRadius:8,padding:'6px 12px',
            cursor:'pointer',transition:'all 0.18s',
            fontFamily:'var(--font-sans)',fontWeight:500,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='var(--color-red)'; e.currentTarget.style.color='var(--color-red)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--color-border-2)'; e.currentTarget.style.color='var(--color-text-3)'; }}
        >
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
          Reset
        </button>
      </header>

      {/* ── Body ── */}
      <div style={{flex:1,display:'flex',overflow:'hidden',minHeight:0}}>

        {/* ── Left: Chat ── */}
        <div style={{
          display:'flex',flexDirection:'column',
          width:400,flexShrink:0,
          borderRight:'1px solid var(--color-border)',
          background:'var(--color-surface)',
          minHeight:0,
        }}>
          {/* Chat header */}
          <div style={{
            padding:'12px 16px',
            borderBottom:'1px solid var(--color-border)',
            display:'flex',alignItems:'center',gap:8,
            flexShrink:0,
          }}>
            <div style={{
              width:7,height:7,borderRadius:'50%',
              background: loading ? 'var(--color-yellow)' : 'var(--color-green)',
              boxShadow: loading ? '0 0 8px var(--color-yellow)' : '0 0 8px var(--color-green)',
              transition:'all 0.3s',
            }}/>
            <span style={{fontSize:12,fontWeight:600,color:'var(--color-text-2)',letterSpacing:'0.04em'}}>
              {loading ? 'Thinking…' : 'Ready'}
            </span>
          </div>

          <ChatWindow messages={messages} loading={loading} />
          <ChatInput onSend={sendMessage} loading={loading} />
        </div>

        {/* ── Right: Preview / JSON ── */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minHeight:0}}>

          {/* Tab bar */}
          <div style={{
            display:'flex',alignItems:'center',gap:6,
            padding:'8px 16px',
            borderBottom:'1px solid var(--color-border)',
            background:'var(--color-surface)',
            flexShrink:0,
          }}>
            <TabBtn
              label="Wireframe"
              icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>}
              active={tab === 'preview'}
              onClick={() => setTab('preview')}
            />
            <TabBtn
              label="JSON"
              icon={<svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/></svg>}
              active={tab === 'json'}
              onClick={() => setTab('json')}
            />

            {/* Artboard size badges */}
            <div style={{marginLeft:'auto',display:'flex',gap:6}}>
              {[['1:1',1080,1080],['9:16',1080,1920],['16:9',1920,1080]].map(([label,w,h]) => {
                const active = artboard?.width === w && artboard?.height === h;
                return (
                  <div key={label} style={{
                    fontSize:10,padding:'3px 8px',borderRadius:6,
                    fontFamily:'var(--font-mono)',
                    background: active ? 'rgba(108,99,255,0.2)' : 'var(--color-surface-2)',
                    border: active ? '1px solid rgba(108,99,255,0.4)' : '1px solid var(--color-border)',
                    color: active ? 'var(--color-accent-2)' : 'var(--color-text-3)',
                    transition:'all 0.2s',
                  }}>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panel content */}
          <div style={{flex:1,overflowY:'auto',padding:20}}>
            {tab === 'preview'
              ? <WireframePreview layout={layout} />
              : <JsonViewer layout={layout} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
