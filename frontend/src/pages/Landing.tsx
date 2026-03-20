import { Link } from 'react-router-dom'
import { Code2, Zap, Shield, Download, Sparkles, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'

const features = [
  { icon: <Zap size={22} />, title: 'Instant Generation', desc: 'Get production-ready Python code in seconds from a plain English description.' },
  { icon: <Code2 size={22} />, title: 'Multiple Project Types', desc: 'Generate code for Mobile Apps, Websites, or Full Stack applications.' },
  { icon: <Shield size={22} />, title: 'Complexity Control', desc: 'Choose Simple, Intermediate, or Advanced complexity to match your skill level.' },
  { icon: <Download size={22} />, title: 'Export Ready', desc: 'Copy to clipboard or download as a .py file instantly.' },
  { icon: <Sparkles size={22} />, title: 'Syntax Highlighted', desc: 'Beautiful code display with full Python syntax highlighting.' },
  { icon: <ArrowRight size={22} />, title: 'History Tracking', desc: 'All your generated prototypes are saved and accessible anytime.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] text-sm px-4 py-1.5 rounded-full mb-6">
          <Sparkles size={14} /> AI-Powered Python Code Generator
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-5 leading-tight">
          Turn Ideas Into<br />
          <span className="text-[var(--primary)]">Python Prototypes</span>
        </h1>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-8">
          Describe your project in plain English. ProtoPy generates clean, structured Python code instantly — no setup required.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/signup" className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
            Get Started Free <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="border border-[var(--border)] hover:border-[var(--primary)] text-[var(--fg)] font-semibold px-6 py-3 rounded-xl transition-colors">
            Sign In
          </Link>
        </div>
      </section>

      {/* Code Preview */}
      <section className="max-w-3xl mx-auto px-4 mb-20">
        <div className="rounded-2xl border border-[var(--border)] bg-[#1e293b] overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#334155]">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-[#64748b]">prototype.py</span>
          </div>
          <pre className="p-5 text-sm text-[#e2e8f0] overflow-x-auto leading-relaxed">
{`from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    done = db.Column(db.Boolean, default=False)

@app.route("/api/tasks")
def get_tasks():
    return jsonify([{"id": t.id, "title": t.title} 
                    for t in Task.query.all()])

if __name__ == "__main__":
    app.run(debug=True)`}
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 hover:border-[var(--primary)] transition-colors">
              <div className="text-[var(--primary)] mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-[var(--muted)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-6 text-center text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} ProtoPy. Built with React + Django.
      </footer>
    </div>
  )
}
