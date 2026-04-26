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
            company: 'Waitlist',
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
    <main className="min-h-screen bg-[#F4ECD8] text-[#4A3728] selection:bg-[#6B2D3E] selection:text-white">
      {/* Texture Overlay */}
      <div className="noise-overlay fixed inset-0 pointer-events-none opacity-[0.03] z-50"></div>

      <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {/* Navigation */}
        <nav className="flex flex-col md:flex-row justify-between items-center mb-24 border-y-2 border-[#4A3728] py-6 gap-6">
          <div className="text-3xl font-bold tracking-tighter text-[#6B2D3E] font-serif">TRACELY.</div>
          <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em]">
            <a href="#philosophy" className="hover:text-[#6B2D3E] transition-colors">Philosophy</a>
            <a href="#engine" className="hover:text-[#6B2D3E] transition-colors">The Engine</a>
            <a href="#beta" className="hover:text-[#6B2D3E] transition-colors">Join Beta</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-32 max-w-4xl mx-auto">
          <span className="inline-block text-[#6B2D3E] font-bold tracking-[0.3em] uppercase text-xs mb-6">Error Contextualization for High-Stakes Engineering</span>
          <h1 className="text-6xl md:text-8xl font-bold mb-10 leading-[1.05] font-serif tracking-tight">
            Stop Guessing,<br />
            <span className="italic text-[#6B2D3E]">Start Shipping.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#4A3728] max-w-2xl mx-auto leading-relaxed mb-12 font-medium opacity-90">
            Tracely bridges the gap between raw telemetry and tribal knowledge. We turn chaotic stack traces into instant, actionable fixes directly in your Slack threads.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="#beta" className="bg-[#6B2D3E] text-[#F4ECD8] px-10 py-4 rounded-[4px] font-bold text-lg hover:bg-[#5A2534] transition-all shadow-[6px_6px_0px_#2C3E50] transform hover:-translate-y-1 active:translate-y-0">
              Join the Private Beta
            </a>
            <a href="#engine" className="px-10 py-4 border-2 border-[#4A3728] rounded-[4px] font-bold text-lg hover:bg-[#2C3E50] hover:text-[#F4ECD8] transition-all shadow-[6px_6px_0px_#4A3728] transform hover:-translate-y-1 active:translate-y-0">
              Read the Manifesto
            </a>
          </div>
        </section>

        {/* Product Visual */}
        <section className="mb-40">
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#6B2D3E]/5 rounded-lg blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white border-2 border-[#4A3728] p-3 rounded-[4px] shadow-[12px_12px_0px_#4A3728]">
              <div className="bg-[#2C3E50] px-4 py-2 flex items-center justify-between border-b-2 border-[#4A3728]">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#6B2D3E]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F4ECD8]/30"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F4ECD8]/30"></div>
                </div>
                <div className="text-[10px] text-[#F4ECD8]/50 uppercase tracking-widest font-bold">Slack Context Preview</div>
              </div>
              <img 
                src="images/a-professional-slack-interface-showing-a.png" 
                alt="Tracely Slack Interface Mockup" 
                className="w-full grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="philosophy" className="grid md:grid-cols-2 gap-20 mb-40 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-8">
              <div className="p-8 bg-white border-2 border-[#4A3728] shadow-[8px_8px_0px_#6B2D3E]">
                <h3 className="text-2xl font-bold mb-3 font-serif">Eliminate Institutional Amnesia</h3>
                <p className="opacity-80 leading-relaxed">Most engineering teams leak knowledge. When a bug recurs, you're not just fighting the code—you're fighting time. Tracely indexes past Slack resolutions to give you the "why" and "how" behind every stack trace.</p>
              </div>
              <div className="p-8 bg-white border-2 border-[#4A3728] shadow-[8px_8px_0px_#2C3E50]">
                <h3 className="text-2xl font-bold mb-3 font-serif">Human-Readable Debugging</h3>
                <p className="opacity-80 leading-relaxed">Stack traces are for machines. Explanations are for humans. Tracely's AI engine translates cryptic error logs into plain English summaries, pinpointing the likely culprit and the specific PR that introduced it.</p>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 font-serif leading-tight">Heritage performance meets <span className="text-[#6B2D3E] italic">future intelligence.</span></h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              We built Tracely for the teams that take reliability personally. It's not just a tool; it's a permanent record of your team's hard-won technical expertise.
            </p>
            <div className="border-t-2 border-[#4A3728] pt-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded bg-[#6B2D3E] flex items-center justify-center text-[#F4ECD8] font-serif text-xl font-bold">40%</div>
                <div className="font-bold text-sm uppercase tracking-wider">Average Reduction in MTTR</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-[#2C3E50] flex items-center justify-center text-[#F4ECD8] font-serif text-xl font-bold">10s</div>
                <div className="font-bold text-sm uppercase tracking-wider">Time to Resolution Insight</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / The Engine */}
        <section id="engine" className="mb-40">
          <div className="text-center mb-20 border-b-2 border-[#4A3728] pb-10">
            <h2 className="text-4xl font-bold font-serif mb-4 uppercase tracking-tighter">The Tracely Technical Stack</h2>
            <p className="text-lg opacity-70">A specialized architecture for high-velocity engineering teams.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Smart Ingestion", desc: "Native integrations with Sentry, Honeycomb, and Datadog. We listen where your errors live." },
              { title: "Tribal Memory", desc: "We index your historical Slack threads and PR comments to find the 'human context' of past fixes." },
              { title: "Zero-Retention AI", desc: "Enterprise-grade privacy. Your code is processed to provide fixes but never stored or used for global training." }
            ].map((f, i) => (
              <div key={i} className="group cursor-default">
                <div className="text-[#6B2D3E] text-4xl font-serif mb-4">0{i+1}.</div>
                <h3 className="text-xl font-bold mb-4 font-serif group-hover:text-[#6B2D3E] transition-colors uppercase tracking-tight">{f.title}</h3>
                <p className="leading-relaxed opacity-80">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Beta Form Section */}
        <section id="beta" className="relative">
          <div className="bg-[#6B2D3E] p-12 md:p-24 text-center rounded-[4px] border-2 border-[#4A3728] shadow-[16px_16px_0px_#2C3E50]">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-[#F4ECD8] font-serif tracking-tight leading-tight">
              Ready to reclaim your <br className="hidden md:block" />
              <span className="italic opacity-80 font-normal">engineering velocity?</span>
            </h2>
            <p className="text-[#F4ECD8] text-xl mb-12 opacity-80 max-w-2xl mx-auto font-medium">
              We are opening 10 exclusive pilot slots for mid-market engineering teams this quarter. Secure your spot in the future of error resolution.
            </p>
            
            {status === 'success' ? (
              <div className="bg-[#F4ECD8] text-[#6B2D3E] p-10 border-2 border-[#2C3E50] rounded-[4px] font-bold text-2xl animate-pulse">
                REGISTRATION SUCCESSFUL. <br />
                <span className="text-sm font-normal uppercase tracking-widest mt-2 block opacity-70 italic">We will contact you within 24 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-[#F4ECD8] border-2 border-[#2C3E50] rounded-[4px] text-[#4A3728] focus:outline-none placeholder:text-[#4A3728]/50 font-bold"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="email" 
                    placeholder="Engineering Email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-[#F4ECD8] border-2 border-[#2C3E50] rounded-[4px] text-[#4A3728] focus:outline-none placeholder:text-[#4A3728]/50 font-bold"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="bg-[#2C3E50] text-[#F4ECD8] px-10 py-4 rounded-[4px] font-bold hover:bg-black transition-all shadow-[6px_6px_0px_#F4ECD8] whitespace-nowrap active:translate-y-1 active:shadow-none"
                >
                  {status === 'loading' ? 'Requesting...' : 'Request Access'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="mt-6 text-[#F43F5E] font-bold uppercase tracking-widest text-xs">Transmission Error. Please verify your connection.</p>
            )}
            <p className="mt-12 text-[10px] text-[#F4ECD8] opacity-50 uppercase tracking-[0.2em] font-bold">EST. 2026 — TRACELY INCORPORATED</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-40 pt-16 border-t-2 border-[#4A3728] text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-10 opacity-60 mb-20">
          <div className="flex flex-col gap-2">
            <p>&copy; 2026 TRACELY INC.</p>
            <p className="text-[10px] opacity-70">SAN FRANCISCO — NEW YORK</p>
          </div>
          <div className="flex gap-12">
            <a href="#" className="hover:text-[#6B2D3E] underline decoration-2 underline-offset-4">Privacy</a>
            <a href="#" className="hover:text-[#6B2D3E] underline decoration-2 underline-offset-4">Legal</a>
            <a href="mailto:samuel@baget.ai" className="hover:text-[#6B2D3E] underline decoration-2 underline-offset-4">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
            <span>System Status: Optimal</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
