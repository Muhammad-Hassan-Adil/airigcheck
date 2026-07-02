import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Zap, Star } from 'lucide-react';
import { PageSEO } from '../../components/seo/PageSEO';

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Best GPUs for Running LLMs Locally in 2026",
  "description": "A practical GPU buying guide for AI engineers who want to self-host large language models. Covers consumer, prosumer, and data center options across all budgets.",
  "author": { "@type": "Organization", "name": "AIRigCheck" },
  "publisher": { "@type": "Organization", "name": "AIRigCheck", "url": "https://airigcheck.com" },
  "datePublished": "2026-07-02",
  "dateModified": "2026-07-02",
  "mainEntityOfPage": "https://airigcheck.com/guides/best-gpus-for-llms"
};

type Tier = 'budget' | 'mid' | 'high' | 'pro';

interface GPUCard {
  name: string;
  vram: string;
  price: string;
  tier: Tier;
  bandwidth: string;
  bestFor: string;
  pros: string[];
  cons: string[];
  badge?: string;
}

const gpus: GPUCard[] = [
  {
    name: 'RTX 4060 / 4060 Ti',
    vram: '8 / 16 GB',
    price: '$300–$450',
    tier: 'budget',
    bandwidth: '272 / 288 GB/s',
    bestFor: '3B–7B models at short context',
    pros: ['Affordable entry point', 'Low power draw (~165W)', 'Good driver support'],
    cons: ['8 GB is tight for 7B at full context', 'Low memory bandwidth limits tokens/sec'],
  },
  {
    name: 'RTX 4070 Ti Super',
    vram: '16 GB',
    price: '$600–$800',
    tier: 'mid',
    bandwidth: '672 GB/s',
    bestFor: '7B–13B models, some 34B at Q4',
    pros: ['16 GB handles 13B comfortably', '2× bandwidth vs 4060 = faster inference', 'Mainstream card with wide support'],
    cons: ['16 GB too small for 34B+ at practical context', 'RTX 5000 series launched — prices in flux'],
    badge: 'Popular',
  },
  {
    name: 'RTX 4090',
    vram: '24 GB',
    price: '$1,600–$2,000',
    tier: 'high',
    bandwidth: '1,008 GB/s',
    bestFor: '7B–34B models at long context; 70B at Q4 offloaded',
    pros: ['24 GB headroom for medium models', 'Highest consumer bandwidth available', 'Excellent for fine-tuning small models'],
    cons: ['Pricey for AI-only use', 'Still too small for 70B+ at full precision'],
    badge: 'Best Consumer',
  },
  {
    name: '2× RTX 3090 / 4090',
    vram: '48 GB',
    price: '$2,000–$4,000',
    tier: 'high',
    bandwidth: '1,400–2,016 GB/s (combined)',
    bestFor: '70B models at Q4, 34B at FP16',
    pros: ['48 GB fits 70B Q4 with room for context', 'Excellent combined bandwidth', 'Cost-effective vs professional cards'],
    cons: ['Requires multi-GPU PCIe setup', 'NVLink not available on consumer cards (PCIe bottleneck at scale)', 'Power: 600–700W combined'],
  },
  {
    name: 'NVIDIA A100 80 GB',
    vram: '80 GB',
    price: '$8,000–$15,000 (used)',
    tier: 'pro',
    bandwidth: '2,000 GB/s (SXM) / 1,935 GB/s (PCIe)',
    bestFor: '70B models at FP16, 405B+ models in multi-card NVLink',
    pros: ['80 GB HBM2e — fits 70B in FP16', 'ECC memory for 24/7 reliability', 'NVLink for multi-card scaling', 'Excellent for fine-tuning large models'],
    cons: ['High cost and power (400W TDP)', 'Requires enterprise PCIe slot or SXM baseboard', 'Not available in retail channels — secondary market only'],
    badge: 'Professional',
  },
  {
    name: 'NVIDIA H100 80 GB',
    vram: '80 GB',
    price: '$25,000–$35,000',
    tier: 'pro',
    bandwidth: '3,350 GB/s (SXM5)',
    bestFor: 'Production inference, fine-tuning frontier models',
    pros: ['Fastest inference of any GPU at time of writing', '3.35 TB/s HBM3 bandwidth', 'NVLink 4.0 for 8-GPU clusters', 'Native FP8 training'],
    cons: ['Extremely expensive', 'Typically cloud-leased rather than owned', 'Overkill for anything under 70B parameters'],
  },
];

const tierLabel: Record<Tier, { label: string; color: string }> = {
  budget: { label: 'Budget', color: 'text-slate-500 bg-slate-100 dark:bg-slate-800' },
  mid: { label: 'Mid-range', color: 'text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300' },
  high: { label: 'High-end', color: 'text-indigo-700 bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300' },
  pro: { label: 'Professional', color: 'text-violet-700 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300' },
};

export const GuideBestGPUs: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto space-y-8"
  >
    <PageSEO
      title="Best GPUs for Running LLMs Locally in 2026 | AIRigCheck"
      description="A practical GPU buying guide for AI engineers. Covers consumer (RTX 4060–4090), prosumer (multi-GPU rigs), and data center cards (A100, H100) with VRAM, bandwidth, and cost comparisons."
      canonical="https://airigcheck.com/guides/best-gpus-for-llms"
      schema={schema}
    />

    <div>
      <Link to="/guides" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
        <ArrowLeft size={16} /> All Guides
      </Link>
    </div>

    <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-10 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Zap size={28} />
          <span className="text-violet-200 text-sm font-medium uppercase tracking-wider">Buying Guide</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">Best GPUs for Running LLMs Locally in 2026</h1>
        <p className="text-violet-100 text-lg leading-relaxed">
          From budget RTX cards that handle 7B models to professional A100s that run 70B in FP16 — here's the complete breakdown of what to buy and why.
        </p>
      </div>

      <div className="px-8 py-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">

        {/* What matters */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What Actually Matters for LLM Inference</h2>
          <p>
            LLM inference is a memory-bandwidth-bound workload, not a compute-bound one. During token generation, the GPU loads model weights from VRAM on every forward pass. The faster it can move data from VRAM to compute units, the more tokens per second you get. This means two specs dominate the buying decision:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5">
              <p className="font-bold text-blue-900 dark:text-blue-300 mb-2">1. VRAM capacity (GB)</p>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                Determines which models you can load at which quantization level. This is the hard ceiling — if a model doesn't fit, it doesn't run (or runs slowly via offloading).
              </p>
            </div>
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800/50 rounded-xl p-5">
              <p className="font-bold text-violet-900 dark:text-violet-300 mb-2">2. Memory bandwidth (GB/s)</p>
              <p className="text-sm text-violet-800 dark:text-violet-400">
                Determines tokens per second once the model is loaded. An A100 with 2,000 GB/s bandwidth generates tokens ~2× faster than an RTX 3090 at 936 GB/s, even with the same model.
              </p>
            </div>
          </div>
          <p className="mt-4">
            CUDA cores and clock speeds matter for training and batch inference, but for single-user interactive inference, bandwidth is king. Always compare GB/s, not just TFLOPS.
          </p>
        </section>

        {/* GPU cards */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">GPU Recommendations by Budget</h2>
          <div className="space-y-6">
            {gpus.map(gpu => {
              const tier = tierLabel[gpu.tier];
              return (
                <div key={gpu.name} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{gpu.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tier.color}`}>{tier.label}</span>
                      {gpu.badge && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 flex items-center gap-1">
                          <Star size={10} /> {gpu.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{gpu.price}</div>
                  </div>
                  <div className="px-5 py-4 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">VRAM</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{gpu.vram}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Bandwidth</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{gpu.bandwidth}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Best for</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{gpu.bestFor}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Pros</p>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                          {gpu.pros.map(p => <li key={p} className="flex gap-2"><span className="text-emerald-500 shrink-0">+</span>{p}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider mb-2">Cons</p>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                          {gpu.cons.map(c => <li key={c} className="flex gap-2"><span className="text-red-400 shrink-0">–</span>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AMD section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What About AMD GPUs?</h2>
          <p>
            AMD's RX 7900 XTX offers 24 GB VRAM at roughly $900 — competitive with the RTX 4090 on capacity but with lower bandwidth. The key limitation is software: most LLM inference frameworks (llama.cpp, vLLM, Ollama) have first-class CUDA support but treat ROCm (AMD's compute platform) as a secondary target. You'll encounter driver headaches, missing features, and slower community support.
          </p>
          <p className="mt-4">
            For pure hobbyist use where you're comfortable debugging, AMD is viable and offers excellent GB-per-dollar. For production workloads, NVIDIA remains the safer choice due to mature tooling.
          </p>
        </section>

        {/* Apple Silicon */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Apple Silicon (M3/M4)</h2>
          <p>
            Apple's unified memory architecture means the GPU and CPU share the same memory pool. An M3 Max with 128 GB memory can technically hold a 70B Q4 model — and llama.cpp has excellent Metal support on Apple Silicon. Inference speed is surprisingly good for the power envelope.
          </p>
          <p className="mt-4">
            The trade-off: memory bandwidth on Apple Silicon (~800 GB/s on M3 Max) is lower than a dedicated A100 but comparable to an RTX 3090. If you're already in the Apple ecosystem and need a machine that does everything, a Mac Studio or Mac Pro is a legitimate AI workstation. If you're building a dedicated AI server, an NVIDIA card in a workstation is usually better value.
          </p>
        </section>

        {/* Quick rec */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Quick Recommendation by Use Case</h2>
          <div className="space-y-3 text-sm">
            {[
              { use: 'Experimenting / hobbyist', rec: 'RTX 4060 Ti 16 GB ($400)', reason: 'Fits 7B–13B models, low power, affordable to start.' },
              { use: 'Daily productivity (coding, writing)', rec: 'RTX 4070 Ti Super 16 GB ($700)', reason: 'Enough for 13B models with long context, strong bandwidth.' },
              { use: 'Power user / small team', rec: 'RTX 4090 24 GB ($1,800)', reason: 'Handles 34B models, can fine-tune smaller models.' },
              { use: 'Running 70B models', rec: '2× RTX 4090 or A100 80GB', reason: '70B Q4 needs 38+ GB; 48 GB spans consumer dual-GPU or a single professional card.' },
              { use: 'Production inference server', rec: 'A100 80GB or H100 (cloud/lease)', reason: 'ECC, NVLink, and reliability features matter at production scale.' },
            ].map(({ use, rec, reason }) => (
              <div key={use} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white">{use}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mt-0.5">{rec}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-lg">Check your specific model</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Enter your GPU and a specific LLM to see exactly what quantization levels fit and what inference speed to expect.</p>
          </div>
          <Link
            to="/hardware-analyzer/tool"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
          >
            Open Hardware Analyzer <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  </motion.div>
);
