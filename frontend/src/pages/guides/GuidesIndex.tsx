import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Cpu, DollarSign, Zap } from 'lucide-react';
import { PageSEO } from '../../components/seo/PageSEO';

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "AI Hardware & LLM Cost Guides",
  "description": "Free technical guides for AI engineers: VRAM calculation, local vs cloud cost analysis, and GPU buying recommendations for running LLMs.",
  "url": "https://airigcheck.com/guides",
  "publisher": { "@type": "Organization", "name": "AIRigCheck", "url": "https://airigcheck.com" }
};

const guides = [
  {
    href: '/guides/vram-calculator-guide',
    icon: <Cpu size={28} className="text-blue-500" />,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-blue-200 dark:border-blue-800/50',
    badge: 'Hardware',
    badgeColor: 'text-blue-700 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300',
    title: 'How to Calculate GPU VRAM for Running LLMs Locally',
    description: "Stop guessing. Learn the exact formula for estimating VRAM from model parameters, quantization format, and context length — then apply it to your hardware.",
    readTime: '8 min read',
  },
  {
    href: '/guides/local-vs-cloud-ai',
    icon: <DollarSign size={28} className="text-emerald-500" />,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/10',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    badge: 'Cost Analysis',
    badgeColor: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300',
    title: 'Local vs Cloud AI: When Does Self-Hosting LLMs Make Financial Sense?',
    description: "A break-even analysis comparing cloud API costs vs owning a GPU. Includes real cost tables, hidden cost breakdowns, and a hybrid strategy that cuts bills by 70–90%.",
    readTime: '10 min read',
  },
  {
    href: '/guides/best-gpus-for-llms',
    icon: <Zap size={28} className="text-violet-500" />,
    color: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-50 dark:bg-violet-900/10',
    border: 'border-violet-200 dark:border-violet-800/50',
    badge: 'Buying Guide',
    badgeColor: 'text-violet-700 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300',
    title: 'Best GPUs for Running LLMs Locally in 2026',
    description: "RTX 4060 to H100 — a practical breakdown of which GPU to buy for your budget and workload, including VRAM, bandwidth, and use-case recommendations.",
    readTime: '9 min read',
  },
];

export const GuidesIndex: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="max-w-4xl mx-auto space-y-8"
  >
    <PageSEO
      title="AI & LLM Guides — Hardware, Cost & Setup | AIRigCheck"
      description="Free technical guides for AI engineers: how to calculate GPU VRAM for LLMs, local vs cloud cost comparison, and the best GPUs for running large language models locally."
      canonical="https://airigcheck.com/guides"
      schema={schema}
    />

    <div>
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="text-blue-500" size={28} />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Engineering Guides</h1>
      </div>
      <p className="text-slate-600 dark:text-slate-400 text-lg">
        Practical, technical guides for developers building with AI — hardware decisions, cost optimization, and infrastructure trade-offs.
      </p>
    </div>

    <div className="space-y-5">
      {guides.map((guide, i) => (
        <motion.div
          key={guide.href}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        >
          <Link
            to={guide.href}
            className={`block rounded-2xl border ${guide.border} ${guide.bgLight} p-6 hover:shadow-md transition-all duration-200 group`}
          >
            <div className="flex items-start gap-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center shrink-0 shadow-sm`}>
                {React.cloneElement(guide.icon, { className: 'text-white' })}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${guide.badgeColor}`}>{guide.badge}</span>
                  <span className="text-xs text-slate-400">{guide.readTime}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {guide.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{guide.description}</p>
              </div>
              <ArrowRight className="shrink-0 text-slate-400 group-hover:text-blue-500 transition-colors mt-1" size={20} />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>

    {/* Related tools */}
    <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Related Tools</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: '/hardware-analyzer/tool', label: 'VRAM Calculator', desc: 'Check if your GPU fits a model' },
          { href: '/cloud-pricing/tool', label: 'Cloud Cost Calculator', desc: 'Compare per-token API pricing' },
          { href: '/rig-configurator/tool', label: 'Rig Configurator', desc: 'Plan a multi-GPU workstation' },
        ].map(({ href, label, desc }) => (
          <Link key={href} to={href} className="block p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-colors group">
            <p className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  </motion.div>
);
