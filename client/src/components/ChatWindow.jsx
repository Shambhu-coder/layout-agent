import { useEffect, useRef } from 'react';

function Avatar({ role }) {
  if (role === 'user') {
    return (
      <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6c63ff,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:11,fontWeight:700,color:'#fff'}}>
        U
      </div>
    );
  }
  return (
    <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#1f2330,#2a2f42)',border:'1px solid #2a2f42',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      <svg width="14" height="14" fill="none" stroke="#6c63ff" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>
      </svg>
    </div>
  );
}

function Message({ message, index }) {
  const isUser = message.role === 'user';
  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${index * 0.04}s`,
        display: 'flex',
        gap: 10,
        marginBottom: 16,
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      <Avatar role={message.role} />
      <div style={{maxWidth:'78%', display:'flex', flexDirection:'column', gap:3, alignItems: isUser ? 'flex-end' : 'flex-start'}}>
        <span style={{fontSize:10,color:'var(--color-text-3)',fontFamily:'var(--font-mono)',letterSpacing:'0.05em'}}>
          {isUser ? 'You' : 'Layout Agent'}
        </span>
        <div style={{
          padding: '10px 14px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser
            ? 'linear-gradient(135deg, #6c63ff, #8b83ff)'
            : 'var(--color-surface-2)',
          border: isUser ? 'none' : '1px solid var(--color-border-2)',
          fontSize: 13.5,
          lineHeight: 1.6,
          color: isUser ? '#fff' : 'var(--color-text-1)',
          whiteSpace: 'pre-wrap',
          boxShadow: isUser ? '0 4px 15px rgba(108,99,255,0.3)' : 'none',
        }}>
          {message.content}
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div style={{display:'flex',gap:10,alignItems:'flex-start',marginBottom:16}}>
      <Avatar role="assistant" />
      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        <span style={{fontSize:10,color:'var(--color-text-3)',fontFamily:'var(--font-mono)'}}>Layout Agent</span>
        <div style={{
          padding:'12px 16px',
          borderRadius:'4px 16px 16px 16px',
          background:'var(--color-surface-2)',
          border:'1px solid var(--color-border-2)',
          display:'flex',gap:5,alignItems:'center',
        }}>
          <span className="dot" style={{width:7,height:7,borderRadius:'50%',background:'var(--color-accent)',display:'inline-block'}}/>
          <span className="dot" style={{width:7,height:7,borderRadius:'50%',background:'var(--color-accent)',display:'inline-block'}}/>
          <span className="dot" style={{width:7,height:7,borderRadius:'50%',background:'var(--color-accent)',display:'inline-block'}}/>
        </div>
      </div>
    </div>
  );
}

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={{flex:1,overflowY:'auto',padding:'20px 16px'}}>
      {messages.map((msg, i) => <Message key={i} message={msg} index={i} />)}
      {loading && <TypingBubble />}
      <div ref={bottomRef} />
    </div>
  );
}
