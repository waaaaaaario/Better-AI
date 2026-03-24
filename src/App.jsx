import React, { useState, useEffect } from 'react';
import { 
  Cpu, Zap, Database, Scissors, Box, Play, 
  TrendingDown, ShieldCheck, Sparkles, Copy, 
  RotateCcw, Terminal, Settings, LayoutDashboard,
  BarChart3, DollarSign, Binary, Activity, WifiOff
} from 'lucide-react';

const PRICING_MODELS = {
  'gemini-pro': { name: 'Gemini 2.5 Pro', input: 15.00 },
  'gpt-4o': { name: 'GPT-4o', input: 5.00 },
  'claude-sonnet': { name: 'Claude 3.5 Sonnet', input: 3.00 },
  'gemini-flash': { name: 'Gemini 2.5 Flash', input: 0.15 }
};

const BetterAI = () => {
  const [selectedModel, setSelectedModel] = useState('gemini-pro');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLinguaOnline, setIsLinguaOnline] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalTokens: 0,
    savedDollars: 0,
    compressionRatio: 0
  });

  const [agents, setAgents] = useState([
    { id: 1, name: 'Researcher', role: 'Lexicon Mapping', status: 'idle', Icon: Binary },
    { id: 2, name: 'Analyst', role: 'LLMLingua Pruning', status: 'idle', Icon: Scissors },
    { id: 4, name: 'TOON Engine', role: 'Shorthand & Structure', status: 'idle', Icon: Box },
    { id: 3, name: 'Synthesizer', role: 'Final Assembly', status: 'idle', Icon: Zap }
  ]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [
      { id: Math.random().toString(36), msg, type, time: new Date().toLocaleTimeString() }, 
      ...prev
    ].slice(0, 8));
  };

  const getEnvVar = (name) => {
    try {
      const meta = import.meta;
      return meta.env[name] || "";
    } catch (e) {
      return "";
    }
  };

  // Check connectivity status on load
  useEffect(() => {
    const token = getEnvVar('VITE_HF_TOKEN');
    setIsLinguaOnline(!!token);
  }, []);

  const applyLexiconMapping = (text) => {
    const dictionary = {
      "artificial intelligence": "AI",
      "machine learning": "ML",
      "San Francisco": "SF",
      "user experience": "UX",
      "sustainability": "s8y",
      "infrastructure": "infra",
      "documentation": "docs",
      "internationalization": "i18n",
      "optimization": "opti",
      "implementation": "impl",
      "tomorrow": "tmw",
      "yesterday": "yest",
      "information": "info",
      "development": "dev",
      "application": "app",
      "management": "mgmt",
      "business": "biz",
      "technology": "tech",
      "communication": "comm"
    };

    let encodedText = text;
    const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

    sortedKeys.forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      if (regex.test(encodedText)) {
        encodedText = encodedText.replace(regex, dictionary[key]);
      }
    });

    return encodedText;
  };

  const applyTOON = (text) => {
    return text
      .replace(/Dear (AI|Assistant|Gemini|GPT),?/gi, "")
      .replace(/I am writing to you (today )?because/gi, "")
      .replace(/Could you please/gi, "")
      .replace(/I would like to know/gi, "Q:")
      .replace(/Thank you (very much|for your help).*$/gi, "")
      .replace(/\bwith regards to\b/gi, "re:")
      .replace(/\bfor example\b/gi, "eg:")
      .replace(/\bthat is to say\b/gi, "ie:")
      .replace(/\band\b/gi, "&")
      .replace(/\s+/g, " ")
      .trim();
  };

  const applyLLMLingua = async (text) => {
    const HF_TOKEN = getEnvVar('VITE_HF_TOKEN');
    if (HF_TOKEN) {
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/microsoft/phi-2", {
          headers: { Authorization: `Bearer ${HF_TOKEN}`, "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({ inputs: `Compress this prompt for AI: ${text}` }),
        });
        const data = await response.json();
        if (data?.[0]?.generated_text) {
          setIsLinguaOnline(true);
          return data[0].generated_text.trim();
        }
      } catch (e) { 
        console.warn("API Offline"); 
        setIsLinguaOnline(false);
      }
    } else {
      setIsLinguaOnline(false);
    }
    return text;
  };

  const handleRunSequence = async () => {
    if (!input) return;
    setIsProcessing(true);
    setLogs([]);
    setOutput('');

    const initialTokens = Math.ceil(input.length / 4);
    addLog(`Input: ${initialTokens} tokens`, "info");

    setAgents(prev => prev.map(a => a.id === 1 ? { ...a, status: 'active' } : a));
    addLog("Researcher: Mapping tokens...", "info");
    const encoded = applyLexiconMapping(input);
    await new Promise(r => setTimeout(r, 600));

    setAgents(prev => prev.map(a => a.id === 4 ? { ...a, status: 'active' } : a));
    addLog("TOON: Removing fluff...", "info");
    const toonResult = applyTOON(encoded);
    await new Promise(r => setTimeout(r, 600));

    setAgents(prev => prev.map(a => a.id === 2 ? { ...a, status: 'active' } : a));
    addLog("LLMLingua: Pruning...", "info");
    const finalResult = await applyLLMLingua(toonResult);
    await new Promise(r => setTimeout(r, 800));

    const finalTokens = Math.ceil(finalResult.length / 4);
    const savings = (Math.max(0, initialTokens - finalTokens) / 1_000_000) * PRICING_MODELS[selectedModel].input;
    const ratio = Math.round((1 - (finalResult.length / input.length)) * 100);

    setOutput(finalResult);
    setStats(prev => ({
      totalTokens: prev.totalTokens + initialTokens,
      savedDollars: prev.savedDollars + savings,
      compressionRatio: ratio > 0 ? ratio : 0
    }));

    setAgents(prev => prev.map(a => ({ ...a, status: 'idle' })));
    addLog(`Success: ${ratio > 0 ? ratio : 0}% reduction.`, "success");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-slate-200 font-sans p-4 md:p-8">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/40">
            <Binary size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Better AI</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Lexicon Encoding Protocol</p>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-[#1a1d2d] border border-slate-800 rounded-xl p-5 shadow-2xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Savings Engine</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 bg-[#0f111a] rounded-lg border border-slate-800/50">
                <div className="text-[10px] text-blue-400 font-bold mb-1 uppercase">Saved</div>
                <div className="text-2xl font-bold">${stats.savedDollars.toFixed(6)}</div>
              </div>
              <div className="p-4 bg-[#0f111a] rounded-lg border border-slate-800/50">
                <div className="text-[10px] text-emerald-400 font-bold mb-1 uppercase">Reduction</div>
                <div className="text-2xl font-bold">-{stats.compressionRatio}%</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Model Pricing</label>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#0f111a] border border-slate-800 rounded-lg p-2.5 text-xs text-blue-400 font-bold outline-none cursor-pointer"
              >
                {Object.keys(PRICING_MODELS).map(k => (
                  <option key={k} value={k}>{PRICING_MODELS[k].name}</option>
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
                  
                  {/* Status Flag for LLMLingua */}
                  {agent.id === 2 && (
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-tighter ${
                      isLinguaOnline 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    }`}>
                      {isLinguaOnline ? <Activity size={10} /> : <WifiOff size={10} />}
                      {isLinguaOnline ? "Live" : "Simulated"}
                    </div>
                  )}

                  {agent.id !== 2 && (
                    <div className={`h-1.5 w-1.5 rounded-full ${agent.status === 'active' ? 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'bg-slate-800'}`} />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <section className="bg-[#1a1d2d] border border-slate-800 rounded-xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2 mb-4">
              <Terminal size={16} className="text-blue-500" /> Source Prompt
            </h3>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full bg-[#0f111a] border border-slate-800 rounded-xl p-5 text-slate-100 placeholder:text-slate-700 outline-none min-h-[160px] text-sm leading-relaxed mb-4 focus:border-blue-500 transition-all resize-none"
            />
            <button 
              onClick={handleRunSequence}
              disabled={isProcessing || !input}
              className="w-full py-4 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
            >
              {isProcessing ? "Compressing Payload..." : "Run Optimization Sequence"}
            </button>
          </section>

          {output && (
            <section className="bg-[#1a1d2d] border border-emerald-500/20 rounded-xl p-6 shadow-2xl animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles size={14} /> Optimized Output
                </span>
                <button onClick={() => setOutput('')} className="text-slate-500 hover:text-slate-200 transition-all">
                  <RotateCcw size={16} />
                </button>
              </div>
              <div className="p-4 bg-[#0f111a] rounded-lg text-sm text-slate-300 whitespace-pre-wrap border border-slate-800/50 leading-relaxed font-mono">
                {output}
              </div>
            </section>
          )}

          <section className="bg-[#0f111a] border border-slate-800 rounded-xl h-28 overflow-y-auto p-4 font-mono text-[10px]">
            {logs.length === 0 && <div className="text-slate-800 italic">Ready...</div>}
            {logs.map(log => (
              <div key={log.id} className="flex gap-2 mb-1">
                <span className="text-slate-700">[{log.time}]</span>
                <span className={log.type === 'success' ? 'text-emerald-500' : 'text-blue-400'}>{log.msg}</span>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default BetterAI;
