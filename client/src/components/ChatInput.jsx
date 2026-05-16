import { useState } from 'react';

const QUICK_PROMPTS = [
  { label: '9:16 Story', prompt: 'Convert this design to 9:16' },
  { label: '16:9 YouTube', prompt: 'Convert this design to 16:9' },
  { label: 'Headline → Top', prompt: 'Move the headline to the top' },
  { label: 'Center Product', prompt: 'Center the product image' },
  { label: 'Badge Bigger', prompt: 'Make the discount badge bigger' },
  { label: 'Red Headline', prompt: 'Change the headline color to red' },
];

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    const t = text.trim();
    if (!t || loading) return;
    onSend(t);
    setText('');
  };

  return (
    <div style={{borderTop:'1px solid var(--color-border)',padding:'12px 14px',background:'var(--color-surface)'}}>
      {/* Quick prompts */}
      <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:10}}>
        {QUICK_PROMPTS.map(({label, prompt}) => (
          <button
            key={label}
            onClick={() => onSend(prompt)}
            disabled={loading}
            className="chip"
            style={{fontSize:11,padding:'4px 10px',borderRadius:99,fontFamily:'var(--font-mono)'}}
          >
            ⚡ {label}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{display:'flex',gap:8,alignItems:'flex-end'}}>
        <div style={{flex:1,position:'relative'}}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }}}
            placeholder="Describe what to change…  (Enter to send)"
            disabled={loading}
            rows={2}
            style={{
              width:'100%',
              background:'var(--color-surface-2)',
              border:'1px solid var(--color-border-2)',
              borderRadius:12,
              padding:'10px 14px',
              fontSize:13.5,
              color:'var(--color-text-1)',
              resize:'none',
              outline:'none',
              fontFamily:'var(--font-sans)',
              lineHeight:1.5,
              transition:'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor='var(--color-accent)'}
            onBlur={e => e.target.style.borderColor='var(--color-border-2)'}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="btn-accent"
          style={{
            borderRadius:12,
            width:44,
            height:44,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            border:'none',
            cursor:'pointer',
            flexShrink:0,
          }}
        >
          {loading
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin-slow"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
          }
        </button>
      </div>
    </div>
  );
}
