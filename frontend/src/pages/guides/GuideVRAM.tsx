import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageSEO } from '../../components/seo/PageSEO';

const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Calculate GPU VRAM for Running LLMs Locally",
  "description": "A complete guide to estimating how much VRAM you need to run any large language model locally, covering quantization, context length, and KV cache.",
  "author": { "@type": "Organization", "name": "AIRigCheck" },
  "publisher": { "@type": "Organization", "name": "AIRigCheck", "url": "https://airigcheck.com" },
  "datePublished": "2026-07-02",
  "dateModified": "2026-07-02",
  "mainEntityOfPage": "https://airigcheck.com/guides/vram-calculator-guide"
};

export const GuideVRAM: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto space-y-8"
  >
    <PageSEO
      title="How to Calculate GPU VRAM for Running LLMs Locally | AIRigCheck"
      description="A complete guide to estimating how much VRAM you need to run any LLM locally. Covers model size, quantization (Q4, Q8, FP16), context length, and KV cache overhead."
      canonical="https://airigcheck.com/guides/vram-calculator-guide"
      schema={schema}
    />

    <div>
      <Link to="/guides" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
        <ArrowLeft size={16} /> All Guides
      </Link>
    </div>

    <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Cpu size={28} />
          <span className="text-blue-200 text-sm font-medium uppercase tracking-wider">Hardware Guide</span>
        </div>
        <h1 className="text-3xl font-bold mb-3">How to Calculate GPU VRAM for Running LLMs Locally</h1>
        <p className="text-blue-100 text-lg leading-relaxed">
          Stop guessing whether your GPU can handle a model. This guide explains exactly how VRAM requirements are calculated — and how to use quantization to make any model fit.
        </p>
      </div>

      <div className="px-8 py-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">

        {/* Quick answer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6">
          <p className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Quick estimate formula</p>
          <code className="block bg-white dark:bg-slate-900 rounded-lg px-4 py-3 text-sm font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            VRAM (GB) = (params_B × bytes_per_param × 1.2) + kv_cache_GB
          </code>
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">Where 1.2 accounts for ~20% runtime overhead. KV cache depends on context length — explained below.</p>
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why VRAM is the Bottleneck</h2>
          <p>
            Unlike a CPU that can page memory to RAM, a GPU must hold everything it needs to compute an inference step — the model weights, the KV cache for your conversation history, and runtime buffers — entirely in VRAM at once. If a model's requirements exceed your GPU's VRAM, it simply won't run at full speed; at best it offloads to RAM (slow), at worst it crashes.
          </p>
          <p className="mt-4">
            This is why the first question when buying a GPU for AI workloads is always "how much VRAM?" — not clock speed, not CUDA cores.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Step 1 — Model Weights</h2>
          <p>
            The largest contributor to VRAM usage is the model weights themselves. A model's parameter count (listed in billions, e.g. "7B", "70B") directly determines the base size. The key variable is the <strong>numeric format</strong> (precision) each parameter is stored in:
          </p>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Format</th>
                  <th className="px-4 py-3 text-left font-semibold">Bytes / param</th>
                  <th className="px-4 py-3 text-left font-semibold">7B model</th>
                  <th className="px-4 py-3 text-left font-semibold">70B model</th>
                  <th className="px-4 py-3 text-left font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="px-4 py-3 font-mono font-semibold">FP32</td>
                  <td className="px-4 py-3">4 bytes</td>
                  <td className="px-4 py-3">~28 GB</td>
                  <td className="px-4 py-3">~280 GB</td>
                  <td className="px-4 py-3 text-slate-500">Original training precision — rarely used for inference</td>
                </tr>
                <tr className="bg-slate-50/50 dark:bg-slate-900/20">
                  <td className="px-4 py-3 font-mono font-semibold">FP16 / BF16</td>
                  <td className="px-4 py-3">2 bytes</td>
                  <td className="px-4 py-3">~14 GB</td>
                  <td className="px-4 py-3">~140 GB</td>
                  <td className="px-4 py-3 text-slate-500">Standard inference on modern GPUs (BF16 preferred)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-semibold">Q8_0</td>
                  <td className="px-4 py-3">1 byte</td>
                  <td className="px-4 py-3">~7 GB</td>
                  <td className="px-4 py-3">~70 GB</td>
                  <td className="px-4 py-3 text-slate-500">8-bit quantization — near-lossless quality</td>
                </tr>
                <tr className="bg-slate-50/50 dark:bg-slate-900/20">
                  <td className="px-4 py-3 font-mono font-semibold">Q4_K_M</td>
                  <td className="px-4 py-3">~0.5 bytes</td>
                  <td className="px-4 py-3">~4 GB</td>
                  <td className="px-4 py-3">~38 GB</td>
                  <td className="px-4 py-3 text-slate-500">4-bit quantization — good quality, half the memory</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono font-semibold">Q2_K</td>
                  <td className="px-4 py-3">~0.25 bytes</td>
                  <td className="px-4 py-3">~2 GB</td>
                  <td className="px-4 py-3">~20 GB</td>
                  <td className="px-4 py-3 text-slate-500">2-bit — smallest, noticeable quality loss</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            For most use cases, <strong>Q4_K_M</strong> is the sweet spot — it cuts memory roughly in half compared to FP16 with minimal perceptible quality degradation. Q8_0 is preferable when you have the VRAM budget and care about output accuracy. Q2 should only be used as a last resort.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Step 2 — KV Cache</h2>
          <p>
            The <strong>KV cache</strong> (Key-Value cache) stores attention layer outputs for every token in your context window so the model doesn't have to recompute them on every new token. It's what makes inference fast — but it costs VRAM proportional to your context length.
          </p>
          <p className="mt-4">
            KV cache size scales with: <code className="bg-slate-100 dark:bg-slate-800 rounded px-2 py-0.5 text-sm">context_length × num_layers × num_heads × head_dim × 2 × bytes_per_element</code>.
          </p>
          <p className="mt-4">
            In practice, this means:
          </p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              ['4K context', 'Llama 3 8B', '~0.5 GB'],
              ['32K context', 'Llama 3 8B', '~4 GB'],
              ['128K context', 'Llama 3 8B', '~16 GB'],
              ['32K context', 'Llama 3 70B', '~28 GB'],
            ].map(([ctx, model, size]) => (
              <li key={ctx+model} className="flex items-center gap-3 text-sm">
                <span className="w-24 text-right font-mono text-blue-600 dark:text-blue-400 shrink-0">{size}</span>
                <span className="text-slate-500">—</span>
                <span><strong>{model}</strong> at {ctx}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            If you're running long conversations or processing large documents, the KV cache can actually exceed the model weights themselves. Tools like <strong>llama.cpp</strong> let you set <code className="bg-slate-100 dark:bg-slate-800 rounded px-1 text-sm">--ctx-size</code> to cap context length and reduce KV cache cost.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Step 3 — Runtime Overhead</h2>
          <p>
            Beyond weights and KV cache, the inference runtime itself (CUDA kernels, activation buffers, temporary tensors) uses VRAM. This overhead is typically <strong>10–25%</strong> of the model weight size. For safety, add a 20% buffer to your estimate. Our calculator uses this formula:
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl px-5 py-4 border border-slate-200 dark:border-slate-700 mt-4 text-sm font-mono">
            total_VRAM = (params_B × bytes_per_param × 1.2) + kv_cache_GB
          </div>
        </section>

        {/* Section 5 — GPU guide */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What GPU Do You Need?</h2>
          <p className="mb-6">Here's a quick reference for common consumer GPUs paired with popular model sizes at Q4_K_M quantization:</p>

          <div className="space-y-3">
            {[
              { gpu: 'RTX 4060 (8 GB)', can: ['7B at 4K ctx', '3B at 32K ctx'], cannot: ['13B+ (tight)', '70B'], color: 'amber' },
              { gpu: 'RTX 4070 Ti / 3090 (24 GB)', can: ['7B at 128K ctx', '13B at 32K ctx', '34B at 4K ctx'], cannot: ['70B at long ctx'], color: 'blue' },
              { gpu: '2× RTX 3090 (48 GB)', can: ['70B at 8K ctx', '34B at 64K ctx'], cannot: ['70B at 128K ctx'], color: 'emerald' },
              { gpu: 'RTX 6000 Ada (48 GB)', can: ['70B at 16K ctx', '34B comfortably'], cannot: ['405B models'], color: 'emerald' },
            ].map(({ gpu, can, cannot, color }) => (
              <div key={gpu} className={`bg-${color}-50 dark:bg-${color}-900/10 border border-${color}-200 dark:border-${color}-800/50 rounded-xl p-5`}>
                <p className="font-bold text-slate-900 dark:text-white mb-3">{gpu}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1"><CheckCircle size={14} /> Can run</p>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                      {can.map(c => <li key={c}>• {c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1"><AlertTriangle size={14} /> Struggles with</p>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                      {cannot.map(c => <li key={c}>• {c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tips for Fitting a Model Into Limited VRAM</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-500 shrink-0">1.</span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Drop quantization first</p>
                <p>Going from FP16 to Q4_K_M halves the model footprint with minimal output quality loss. Try Q8 first, then Q4 if still tight.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-500 shrink-0">2.</span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Reduce context length</p>
                <p>Set <code className="bg-slate-100 dark:bg-slate-800 rounded px-1 text-sm">--ctx-size 4096</code> in llama.cpp (or equivalent) unless you specifically need long context. This can free several GB of KV cache.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-500 shrink-0">3.</span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Use layer offloading</p>
                <p>llama.cpp's <code className="bg-slate-100 dark:bg-slate-800 rounded px-1 text-sm">--n-gpu-layers</code> lets you run some layers on GPU and the rest on CPU RAM. You lose inference speed but can run models larger than your VRAM.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl font-bold text-blue-500 shrink-0">4.</span>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Use flash attention</p>
                <p>Flash Attention 2 reduces KV cache memory by computing attention in blocks without materializing the full attention matrix. Supported by most modern inference frameworks.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-lg">Check your actual GPU</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Enter any model and quantization level into our free VRAM calculator to get a precise estimate for your hardware.</p>
          </div>
          <Link
            to="/hardware-analyzer/tool"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
          >
            Open VRAM Calculator <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  </motion.div>
);
