'use client';

import { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await fetch('https://stg-app.baget.ai/api/public/databases/daac5c3c-86ff-4dc3-8d45-5a896988a31a/rows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            email,
            name,
            company: '', // Optional field
            source: 'Landing Page'
          }
        })
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 relative z-10">
      {/* Header */}
      <nav className="flex justify-between items-center mb-24 border-b-2 border-[#4A3728] pb-6">
        <div className="text-2xl font-bold tracking-tighter text-[#6B2D3E]">TRACELY.</div>
        <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
          <a href="#features" className="hover:text-[#6B2D3E]">Features</a>
          <a href="#demo" className="hover:text-[#6B2D3E]">The Engine</a>
          <a href="#waitlist" className="hover:text-[#6B2D3E]">Join Waitlist</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center mb-32">
        <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
          Stop solving the <br />
          <span className="text-[#6B2D3E] italic">same bug twice.</span>
        </h1>
        <p className="text-xl md:text-2xl text-[#4A3728] max-w-2xl mx-auto leading-relaxed mb-12">
          Tracely indexes your team's tribal knowledge to turn chaotic stack traces into instant fixes directly in Slack.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a href="#waitlist" className="btn-primary">Get Early Access</a>
          <a href="#demo" className="px-6 py-3 border-2 border-[#4A3728] rounded-[4px] font-bold hover:bg-[#2C3E50] hover:text-white transition-all shadow-[4px_4px_0px_#4A3728]">View Engine Docs</a>
        </div>
      </section>

      {/* Hero Image */}
      <section className="mb-32">
        <div className="card overflow-hidden p-2">
          <img 
            src="images/a-professional-slack-interface-showing-a.png" 
            alt="Tracely Slack Bot in action" 
            className="w-full grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
          />
        </div>
      </section>

      {/* The Problem Section */}
      <section id="features" className="grid md:grid-cols-2 gap-16 mb-32 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-6">Institutional Amnesia is killing your MTTR.</h2>
          <p className="text-lg leading-relaxed mb-6">
            When a critical error hits, the resolution is often buried in a Slack thread from months ago. Engineers waste 40% of on-call time re-discovering fixes that already exist.
          </p>
          <ul className="space-y-4 font-bold">
            <li className="flex items-start gap-3">
              <span className="text-[#6B2D3E] text-2xl leading-none">†</span>
              <span>Automated Post-Mortem Stitching</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6B2D3E] text-2xl leading-none">†</span>
              <span>Cross-Incident Tribal Knowledge Retrieval</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#6B2D3E] text-2xl leading-none">†</span>
              <span>AI-Generated Root Cause Summaries</span>
            </li>
          </ul>
        </div>
        <div className="space-y-6">
          <div className="card bg-[#2C3E50] text-white">
            <code className="text-sm text-blue-300"># prod-alerts</code>
            <div className="mt-4 font-mono text-sm border-l-2 border-[#6B2D3E] pl-4 py-2 bg-black/20">
              TypeError: Cannot read properties of undefined (reading 'userId')
              <br />
              at AuthService.validateSession (auth.ts:42:12)
            </div>
            <div className="mt-4 flex gap-3">
              <div className="w-8 h-8 rounded bg-[#6B2D3E] flex items-center justify-center font-bold">T</div>
              <div>
                <p className="font-bold text-[#F4ECD8]">Tracely BOT</p>
                <p className="text-sm opacity-80">This looks like the session timeout fix by @samuel on March 12. View Thread →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr />

      {/* The Engine / API Section */}
      <section id="demo" className="mb-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">The Tracely Engine</h2>
          <p className="max-w-xl mx-auto">Our specialized LLM pipeline processes raw telemetry and reconstructs human context.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card">
            <h3 className="font-bold text-xl mb-4 text-[#6B2D3E]">Capture</h3>
            <p className="text-sm">Intersects raw stack traces from Sentry, Datadog, or CloudWatch via Slack Webhooks.</p>
          </div>
          <div className="card">
            <h3 className="font-bold text-xl mb-4 text-[#6B2D3E]">Contextualize</h3>
            <p className="text-sm">Indexes past incident threads and GitHub PRs to find the specific "human resolution" path.</p>
          </div>
          <div className="card">
            <h3 className="font-bold text-xl mb-4 text-[#6B2D3E]">Resolve</h3>
            <p className="text-sm">Delivers a formatted Slack Block with the explanation, the fix, and the historical link.</p>
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section id="waitlist" className="card bg-[#6B2D3E] text-white text-center py-20 px-8">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#F4ECD8]">Join the Private Beta</h2>
        <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
          We are opening 10 spots for engineering teams to slash their MTTR by 40%.
        </p>
        
        {status === 'success' ? (
          <div className="bg-[#F4ECD8] text-[#6B2D3E] p-8 rounded-[4px] font-bold text-xl">
            You're on the list. We'll be in touch shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Name" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-[4px] text-[#4A3728] focus:outline-none border-2 border-transparent focus:border-[#2C3E50]"
            />
            <input 
              type="email" 
              placeholder="Engineering Email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-[4px] text-[#4A3728] focus:outline-none border-2 border-transparent focus:border-[#2C3E50]"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-[#F4ECD8] text-[#6B2D3E] px-8 py-3 rounded-[4px] font-bold hover:bg-white transition-all shadow-[4px_4px_0px_#2C3E50]"
            >
              {status === 'loading' ? 'Joining...' : 'Secure Access'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="mt-4 text-[#F43F5E] font-bold">Something went wrong. Please try again.</p>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-32 pt-12 border-t-2 border-[#4A3728] text-sm flex flex-col md:flex-row justify-between items-center gap-8 opacity-70 italic">
        <p>&copy; 2026 Tracely Inc. Built for on-call sanity.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="mailto:samuel@baget.ai" className="hover:underline">Contact Founders</a>
        </div>
      </footer>
    </main>
  );
}
