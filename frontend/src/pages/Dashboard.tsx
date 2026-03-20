import { useState, useRef, useEffect } from 'react'
import { Copy, Download, Loader2, Sparkles, History, X, Check } from 'lucide-react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { oneDark } from '@codemirror/theme-one-dark'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { getHistory } from '../api/endpoints'

const PROJECT_TYPES = ['Website', 'Mobile App', 'Full Stack']
const COMPLEXITIES = ['Simple', 'Intermediate', 'Advanced']

interface HistoryItem {
  id: number
  idea: string
  project_type: string
  complexity: string
  generated_code: string
  created_at: string
}

export default function Dashboard() {
  const { user } = useAuth()
  const { dark } = useTheme()
  const [idea, setIdea] = useState('')
  const [projectType, setProjectType] = useState('Website')
  const [complexity, setComplexity] = useState('Simple')
  const [code, setCode] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    loadHistory()
    return () => eventSourceRef.current?.close()
  }, [])

  const loadHistory = async () => {
    try {
      const { data } = await getHistory()
      setHistory(data)
    } catch {}
  }

  const handleGenerate = async () => {
    if (!idea.trim()) return toast.error('Please enter a project idea')
    setCode('')
    setStreaming(true)

    const token = localStorage.getItem('access')
    const url = `/api/generate/stream/`

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idea, project_type: projectType, complexity }),
      })

      if (!res.ok) throw new Error('Generation failed')

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let fullCode = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        const lines = text.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const payload = line.slice(6)
            if (payload === '[DONE]') {
              setStreaming(false)
              toast.success('Code generated!')
              loadHistory()
              return
            }
            try {
              const { chunk } = JSON.parse(payload)
              fullCode += chunk
              setCode(fullCode)
            } catch {}
          }
        }
      }
    } catch (err) {
      toast.error('Generation failed. Please try again.')
    } finally {
      setStreaming(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${idea.slice(0, 20).replace(/\s+/g, '_').toLowerCase() || 'prototype'}.py`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Downloaded!')
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.username} 👋</h1>
            <p className="text-[var(--muted)] text-sm mt-1">Describe your idea and generate Python code instantly</p>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 text-sm border border-[var(--border)] px-4 py-2 rounded-xl hover:border-[var(--primary)] transition-colors"
          >
            <History size={16} /> History ({history.length})
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-5">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <label className="block text-sm font-semibold mb-2">Project Idea</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. A task management app with user authentication and real-time updates..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] focus:outline-none focus:border-[var(--primary)] transition-colors text-sm resize-none"
              />

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-2">Project Type</label>
                  <div className="flex flex-col gap-1.5">
                    {PROJECT_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setProjectType(t)}
                        className={`text-sm px-3 py-2 rounded-lg border transition-colors text-left ${
                          projectType === t
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--muted)] mb-2">Complexity</label>
                  <div className="flex flex-col gap-1.5">
                    {COMPLEXITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setComplexity(c)}
                        className={`text-sm px-3 py-2 rounded-lg border transition-colors text-left ${
                          complexity === c
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] font-medium'
                            : 'border-[var(--border)] hover:border-[var(--primary)]/50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={streaming}
                className="mt-5 w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {streaming ? (
                  <><Loader2 size={18} className="animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles size={18} /> Generate Code</>
                )}
              </button>
            </div>

            {/* History Panel */}
            {showHistory && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Recent Generations</h3>
                  <button onClick={() => setShowHistory(false)}><X size={16} className="text-[var(--muted)]" /></button>
                </div>
                {history.length === 0 ? (
                  <p className="text-sm text-[var(--muted)] text-center py-4">No history yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {history.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => { setCode(h.generated_code); setIdea(h.idea); setProjectType(h.project_type); setComplexity(h.complexity) }}
                        className="w-full text-left p-3 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
                      >
                        <p className="text-sm font-medium truncate">{h.idea}</p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">{h.project_type} · {h.complexity}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-[var(--muted)]">output.py</span>
              </div>
              {code && (
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg)]">
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--fg)] transition-colors px-2 py-1 rounded-lg hover:bg-[var(--bg)]">
                    <Download size={14} /> Download
                  </button>
                </div>
              )}
            </div>

            <div className="min-h-[400px]">
              {!code && !streaming ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-[var(--muted)]">
                  <Sparkles size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">Your generated code will appear here</p>
                </div>
              ) : (
                <CodeMirror
                  value={code}
                  extensions={[python()]}
                  theme={dark ? oneDark : undefined}
                  editable={false}
                  basicSetup={{ lineNumbers: true, foldGutter: false }}
                  style={{ fontSize: '13px', minHeight: '400px' }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
