import React, { useState, useRef, useEffect } from 'react'

export default function SimpleTabs({ children, defaultIndex = 0 }) {
  const items = React.Children.toArray(children).filter(Boolean).map((c) => ({
    title: c.props.title,
    content: c.props.children,
  }))
  const [active, setActive] = useState(Math.min(defaultIndex, Math.max(0, items.length - 1)))
  const tablistRef = useRef(null)

  useEffect(() => {
    if (active >= items.length) setActive(0)
  }, [children])

  function focusTab(i) {
    const btns = tablistRef.current?.querySelectorAll('[role="tab"]')
    if (btns && btns[i]) btns[i].focus()
  }

  function onKeyDown(e, i) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (i + 1) % items.length
      setActive(next)
      focusTab(next)
      return
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (i - 1 + items.length) % items.length
      setActive(prev)
      focusTab(prev)
      return
    }
    if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
      focusTab(0)
      return
    }
    if (e.key === 'End') {
      e.preventDefault()
      setActive(items.length - 1)
      focusTab(items.length - 1)
      return
    }
  }

  return (
    <div>
      <div
        role="tablist"
        ref={tablistRef}
        aria-label="Tabs"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
      >
        {items.map((it, i) => (
          <button
            key={i}
            role="tab"
            id={`tab-${i}`}
            aria-controls={`tab-panel-${i}`}
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            style={{
              flex: '0 0 auto',
              padding: '0.4rem 0.8rem',
              borderRadius: 8,
              border: '1px solid rgba(0,0,0,0.08)',
              background: active === i ? '#0ea5e9' : 'white',
              color: active === i ? 'white' : 'inherit',
              cursor: 'pointer',
            }}
          >
            {it.title ?? `Tab ${i + 1}`}
          </button>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem' }}>
        {items.map((it, i) => (
          <div
            key={i}
            role="tabpanel"
            id={`tab-panel-${i}`}
            aria-labelledby={`tab-${i}`}
            hidden={active !== i}
          >
            {active === i && it.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Tab({ children }) {
  return <>{children}</>
}
