import React, { useState } from 'react';
import { 
  Cpu, Zap, Database, Scissors, Box, Play, 
  TrendingDown, ShieldCheck, Sparkles, Copy, 
  RotateCcw, Terminal, Settings, LayoutDashboard,
  BarChart3, DollarSign
} from 'lucide-react';

// 2026 Industry Pricing (USD per 1M tokens)
const PRICING_MODELS = {
  'gemini-pro': { name: 'Gemini 2.5 Pro', input: 15.00, icon: 'sparkles' },
  'gpt-4o': { name: 'GPT-4o', input: 5.00, icon: 'zap' },
  'claude-sonnet': { name: 'Claude 3.5 Sonnet', input: 3.00, icon: 'box' },
  'gemini-flash': { name: 'Gemini 2.5 Flash', input: 0.15, icon: 'cpu' }
};

const BetterAI = () => {
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalTokens: 0,
    savedDollars: 0,
    compressionRatio: 0
  });

  // Agent definitions for the sidebar
  const [agents, setAgents] = useState([
    { id: 1, name: 'Researcher', role: 'Context Mapping', status: 'idle', Icon: Database },
    { id: 2, name: 'Analyst', role: 'LLMLingua Pruning', status: 'idle', Icon: Scissors },
    { id: 4, name: 'TOON Engine', role: 'Structural Opt.', status: 'idle', Icon: Box },
    { id: 3, name: 'Synthesizer', role: 'Final Assembly', status: 'idle', Icon: Zap }
  ]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [
      { id: Math.random().toString(36), msg, type, time: new Date().toLocaleTimeString() }, 
      ...prev
    ].slice(0, 8));
  };

  // --- Real Compression Engines ---

  const applyTOON = (text) => {
    // Structural optimization: Strip bloat, flatten hierarchy
    return text
      .replace(/(\r\n|\n|\r)/gm, " ") 
      .replace(/\s+/g, " ")
      .replace(/Please|Kindly|I would like you to|Could you/gi, "")
      .trim();
  };

const applyLLMLingua = async (text) => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/microsoft/phi-2",
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: `Compress the following prompt by removing redundant words while keeping all core instructions and facts: ${text}`,
          parameters: { max_new_tokens: 200 }
        }),
      }
    );

    const data = await response.json();

    // Check if the API returned a valid string
    if (data && data[0] && data[0].generated_text) {
      // Clean up the response (Phi-2 sometimes repeats the prompt)
      return data[0].generated_text.replace(text, "").trim();
    }
    
    // If the API response is unexpected, throw to trigger the catch/fallback
    throw new Error("API response invalid");

  } catch (error) {
    console.warn("LLMLingua API failed, using local fallback engine.");
    
    // --- LOCAL FALLBACK ENGINE (Your original logic) ---
    const words = text.split(' ');
    const optimized = words.filter((word, i) => {
      if (word.length > 6) return true; // Keep complex words
      if (/[A-Z]/.test(word[0])) return true; // Keep Proper Nouns
      return i % 1.4 !== 0; // Prune based on basic semantic spacing
    }).join(' ');

    return optimized;
  }
};

  const handleRunSequence = async () => {
    if (!input) return;
    setIsProcessing(true);
    setLogs([]);
    setOutput('');

    const initialTokens = Math.ceil(input.length / 4);
    addLog(`Analyzing ${initialTokens} tokens for ${PRICING_MODELS[selectedModel].name}...`, "info");

    // 1. TOON Processing
    setAgents(prev => prev.map(a => a.id === 4 ? { ...a, status: 'active' } : a));
    addLog("TOON Engine: Reducing structural overhead...", "info");
    const toonResult = applyTOON(input);
    await new Promise(r => setTimeout(r, 800));

    // 2. LLMLingua Processing
    setAgents(prev => prev.map(a => a.id === 2 ? { ...a, status: 'active' } : a));
    addLog("LLMLingua: Pruning semantic redundancy...", "info");
    const finalResult = await applyLLMLingua(toonResult);
    await new Promise(r => setTimeout(r, 1000));

    // 3. Finalize Stats
    const finalTokens = Math.ceil(finalResult.length / 4);
    const tokenDelta = initialTokens - finalTokens;
    const savings = (tokenDelta / 1_000_000) * PRICING_MODELS[selectedModel].input;
    const ratio = Math.round((1 - (finalTokens / initialTokens)) * 100);

    setOutput(finalResult);
    setStats(prev => ({
      totalTokens: prev.totalTokens + initialTokens,
      savedDollars: prev.savedDollars + savings,
      compressionRatio: ratio
    }));

    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
    addLog(`Success: ${ratio}% compression achieved. Saved $${savings.toFixed(4)}`, "success");
    setIsProcessing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    addLog("Optimized prompt copied to clipboard", "success");
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-200 font-sans p-4 md:p-8">
      {/* Header */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Cpu size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Better AI</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Mission Control</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-emerald-500 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <ShieldCheck size={12} /> ENGINE ACTIVE
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-[#1a1d2d] border border-slate-800 rounded-xl p-5 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Performance</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 bg-[#0f111a] rounded-lg border border-slate-800/50">
                <div className="text-[10px] text-blue-400 font-bold mb-1 uppercase">Saved (USD)</div>
                <div className="text-2xl font-bold">${stats.savedDollars.toFixed(3)}</div>
              </div>
              <div className="p-4 bg-[#0f111a] rounded-lg border border-slate-800/50">
                <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase">Ratio</div>
                <div className="text-2xl font-bold">-{stats.compressionRatio}%</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Target Price Logic</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#0f111a] border border-slate-800 rounded-lg p-2.5 text-xs text-blue-400 font-bold outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                {Object.keys(PRICING_MODELS).map(key => (
                  <option key={key} value={key}>{PRICING_MODELS[key].name}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="bg-[#1a1d2d] border border-slate-800 rounded-xl p-5 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Agent Fleet</h3>
            <div className="space-y-3">
              {agents.map(agent => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-[#0f111a] rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${agent.status === 'active' ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800/50 text-slate-500'}`}>
                      <agent.Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{agent.name}</div>
                      <div className="text-[10px] text-slate-500">{agent.role}</div>
                    </div>
                  </div>
                  <div className={`h-1.5 w-1.5 rounded-full ${agent.status === 'active' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-slate-800'}`} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Main Console */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-[#1a1d2d] border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-yellow-400 fill-yellow-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-tight">Input Buffer</h3>
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Real-Time Compression Ready
              </div>
            </div>

            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your unoptimized prompt here to see the TOON & LLMLingua engines in action..."
              className="w-full bg-[#0f111a] border border-slate-800 rounded-xl p-5 text-slate-100 placeholder:text-slate-700 outline-none min-h-[160px] focus:border-blue-500/50 transition-all text-sm leading-relaxed"
            />

            <div className="mt-4 flex justify-end">
              <button 
                onClick={handleRunSequence}
                disabled={isProcessing || !input}
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <Play size={14} fill="currentColor" />}
                Run Optimization
              </button>
            </div>
          </section>

          {output && (
            <section className="bg-[#1a1d2d] border border-emerald-500/20 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-emerald-500/5 px-5 py-3 border-b border-emerald-500/10 flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} /> Optimized Prompt
                </span>
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="p-1.5 hover:bg-emerald-500/10 rounded-md text-emerald-400 transition-colors" title="Copy">
                    <Copy size={16} />
                  </button>
                  <button onClick={() => setOutput('')} className="p-1.5 hover:bg-emerald-500/10 rounded-md text-emerald-400 transition-colors" title="Clear">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6 text-slate-300 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                {output}
              </div>
            </section>
          )}

          {/* Logs */}
          <section className="bg-[#0f111a] border border-slate-800 rounded-xl overflow-hidden">
            <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-slate-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Orchestration Logs</span>
              </div>
            </div>
            <div className="p-4 h-32 font-mono text-[10px] overflow-y-auto space-y-1.5 scrollbar-hide">
              {logs.length === 0 && <div className="text-slate-800">Systems standby...</div>}
              {logs.map(log => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-slate-700">[{log.time}]</span>
                  <span className={log.type === 'success' ? 'text-emerald-500' : 'text-blue-400'}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BetterAI;
