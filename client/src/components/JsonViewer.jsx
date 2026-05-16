import { useState } from 'react';

function highlight(json) {
  return JSON.stringify(json, null, 2).replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    match => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) return `<span class="json-key">${match}</span>`;
        return `<span class="json-string">${match}</span>`;
      }
      if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`;
      if (/null/.test(match)) return `<span class="json-null">${match}</span>`;
      return `<span class="json-number">${match}</span>`;
    }
  );
}

export default function JsonViewer({ layout }) {
  const [copied, setCopied] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(layout, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const nodeCount = Object.keys(layout.nodes || {}).length;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',gap:10}}>
      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
        <div style={{
          display:'flex',alignItems:'center',gap:6,
          background:'var(--color-surface-2)',
          border:'1px solid var(--color-border)',
          borderRadius:8,padding:'4px 10px',fontSize:11,
          color:'var(--color-text-2)',fontFamily:'var(--font-mono)',
        }}>
          <span style={{color:'var(--color-accent)'}}>◆</span>
          {nodeCount} nodes
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:6}}>
          <button onClick={() => setCollapsed(c => !c)}
            style={{background:'var(--color-surface-2)',border:'1px solid var(--color-border-2)',color:'var(--color-text-2)',borderRadius:6,padding:'4px 10px',fontSize:11,cursor:'pointer',fontFamily:'var(--font-mono)',transition:'all 0.15s'}}
            onMouseEnter={e => e.currentTarget.style.borderColor='var(--color-accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='var(--color-border-2)'}
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
          <button onClick={copy}
            style={{
              background: copied ? 'rgba(34,197,94,0.15)' : 'var(--color-surface-2)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'var(--color-border-2)'}`,
              color: copied ? 'var(--color-green)' : 'var(--color-text-2)',
              borderRadius:6,padding:'4px 10px',fontSize:11,cursor:'pointer',
              fontFamily:'var(--font-mono)',transition:'all 0.2s',
            }}
          >
            {copied ? '✓ Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {/* JSON body */}
      <div style={{
        flex:1,overflowY:'auto',
        background:'var(--color-surface-2)',
        border:'1px solid var(--color-border)',
        borderRadius:10,
        padding:'14px',
      }}>
        {collapsed
          ? <pre style={{fontSize:12,fontFamily:'var(--font-mono)',color:'var(--color-text-3)',margin:0}}>{'// JSON collapsed — click Expand to view'}</pre>
          : <pre
              style={{fontSize:12,fontFamily:'var(--font-mono)',margin:0,lineHeight:1.7,whiteSpace:'pre-wrap',wordBreak:'break-word'}}
              dangerouslySetInnerHTML={{__html: highlight(layout)}}
            />
        }
      </div>
    </div>
  );
}
