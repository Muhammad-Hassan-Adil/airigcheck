import React, { useState, useMemo } from 'react';
import { calculateHardwareMatch } from '../utils/memoryMath';
import { Card } from '../../../components/common/Card';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { ToolHeader } from '../../../components/common/ToolHeader';
import { GPUSearchSelector } from '../../../components/common/GPUSearchSelector';
import type { GPU } from '../../../types/database.types';

export const UpgradePlanner: React.FC = () => {
  const [selectedGpu, setSelectedGpu] = useState<GPU | null>(null);

  const calculateMaxParams = (vramGb: number) => {
    // Math: total_vram - 1.5 (OS) = params * ((4/8) * 1.15 + 0.1)
    // -> params = (vramGb - 1.5) / 0.675
    const params = (vramGb - 1.5) / 0.675;
    return Math.max(0, Math.floor(params));
  };

  const getSpeedForParams = (vramGb: number, bw: number, params: number) => {
    const res = calculateHardwareMatch({
      gpuVramGb: vramGb,
      gpuMemoryBandwidthGbps: bw,
      systemRamGb: 32,
      systemRamBandwidthGbps: 60,
      parametersBillion: params,
      bitsPerWeight: 4,
      targetSequenceLength: 2048,
    });
    return res.estimatedTokensPerSecond;
  };

  const currentParams = selectedGpu ? calculateMaxParams(selectedGpu.vram_gb) : 0;
  const currentSpeed = selectedGpu ? getSpeedForParams(selectedGpu.vram_gb, selectedGpu.memory_bandwidth_gb_s || 400, currentParams) : 0;

  const UPGRADE_LADDER = [
    { vram: 8,  name: 'RTX 4060 Ti (8GB)',   bw: 288,  costLabel: '~$350-450' },
    { vram: 12, name: 'RTX 3060 (12GB)',      bw: 360,  costLabel: '~$250-350' },
    { vram: 16, name: 'RTX 4060 Ti 16GB',    bw: 288,  costLabel: '~$500-600' },
    { vram: 20, name: 'RX 7900 GRE (16GB)',  bw: 576,  costLabel: '~$450-550' },
    { vram: 24, name: 'RTX 4090 (24GB)',      bw: 1008, costLabel: '~$1500-1800' },
    { vram: 32, name: 'RTX 6000 Ada (48GB)', bw: 960,  costLabel: '~$3500-4500' },
    { vram: 48, name: 'RTX 6000 Ada (48GB)', bw: 960,  costLabel: '~$3500-4500' },
    { vram: 80, name: 'A100 80GB',           bw: 2000, costLabel: '~$10,000+' },
  ];

  const roadmap = useMemo(() => {
    if (!selectedGpu) return { step2: null, step3: null };

    const currentVram = selectedGpu.vram_gb;
    
    // Find next GPU in ladder above current VRAM
    const step2Gpu = UPGRADE_LADDER.find(g => g.vram > currentVram);
    // Find the one after that
    const step3Gpu = step2Gpu 
      ? UPGRADE_LADDER.find(g => g.vram > step2Gpu.vram) 
      : null;

    const makeStep = (gpu: typeof UPGRADE_LADDER[0]) => ({
      name: `1x ${gpu.name}`,
      vram: gpu.vram,
      bw: gpu.bw,
      costLabel: gpu.costLabel,
      action: 'Upgrade to'
    });

    return {
      step2: step2Gpu ? makeStep(step2Gpu) : null,
      step3: step3Gpu ? makeStep(step3Gpu) : null,
    };
  }, [selectedGpu]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-8">
        <ToolHeader 
          icon={<TrendingUp className="text-emerald-500" size={24} />}
          title="Upgrade Planner"
          description="See exactly what upgrading your current GPU will allow you to run, and the estimated cost to get there."
          tip="Running multiple GPUs allows you to pool VRAM to run larger models, but doesn't necessarily make smaller models run faster."
        />
      </div>

      <Card className="p-6 overflow-visible">
        <div className="max-w-xl mx-auto mb-10 relative z-20 overflow-visible">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 text-center">Select Your Current GPU</h3>
          <div className="relative z-10">
            <GPUSearchSelector 
              label=""
              selectedGpu={selectedGpu}
              onSelect={setSelectedGpu}
              placeholder="Search your current GPU..."
            />
          </div>
        </div>

        {selectedGpu && (
          <>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wide text-center">Upgrade Roadmap</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector Lines (desktop only) */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10 -translate-y-1/2"></div>

              {/* Step 1: Current */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center text-center relative z-10 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-base font-bold text-slate-600 dark:text-slate-400 mb-4 ring-4 ring-white dark:ring-slate-950">1</div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Now</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2 h-10 flex items-center justify-center">1x {selectedGpu.name}</p>
                <div className="bg-white dark:bg-slate-950 rounded-lg p-3 w-full border border-slate-100 dark:border-slate-800/60">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Max Model: {currentParams > 0 ? `${currentParams}B` : 'Too small'}</p>
                  <p className="text-xs text-slate-500">Speed: {currentParams > 0 ? `${Math.round(currentSpeed)} tok/s` : 'N/A'}</p>
                </div>
                
                <ArrowRight className="md:hidden text-slate-300 dark:text-slate-700 mt-4" size={24} />
              </div>

              {/* Step 2 */}
              <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl p-6 flex flex-col items-center text-center relative z-10 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-base font-bold text-blue-600 dark:text-blue-400 mb-4 ring-4 ring-white dark:ring-slate-950">2</div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Next ({roadmap.step2?.costLabel})</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2 h-10 flex items-center justify-center flex-col leading-tight">
                  <span className="text-xs font-normal text-slate-500">{roadmap.step2?.action}</span>
                  {roadmap.step2?.name}
                </p>
                <div className="bg-white dark:bg-slate-950 rounded-lg p-3 w-full border border-blue-100 dark:border-blue-900/30">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Max Model: {calculateMaxParams(roadmap.step2?.vram || 0)}B</p>
                  <p className="text-xs text-slate-500">Speed: {Math.round(getSpeedForParams(roadmap.step2?.vram || 0, roadmap.step2?.bw || 400, calculateMaxParams(roadmap.step2?.vram || 0)))} tok/s</p>
                </div>

                <ArrowRight className="md:hidden text-slate-300 dark:text-slate-700 mt-4" size={24} />
              </div>

              {/* Step 3 */}
              <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-6 flex flex-col items-center text-center relative z-10 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-base font-bold text-indigo-600 dark:text-indigo-400 mb-4 ring-4 ring-white dark:ring-slate-950">3</div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Future ({roadmap.step3?.costLabel})</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2 h-10 flex items-center justify-center flex-col leading-tight">
                  <span className="text-xs font-normal text-slate-500">{roadmap.step3?.action}</span>
                  {roadmap.step3?.name}
                </p>
                <div className="bg-white dark:bg-slate-950 rounded-lg p-3 w-full border border-indigo-100 dark:border-indigo-900/30">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Max Model: {calculateMaxParams(roadmap.step3?.vram || 0)}B</p>
                  <p className="text-xs text-slate-500">Speed: {Math.round(getSpeedForParams(roadmap.step3?.vram || 0, roadmap.step3?.bw || 400, calculateMaxParams(roadmap.step3?.vram || 0)))} tok/s</p>
                </div>
              </div>
            </div>
          </>
        )}

        {!selectedGpu && (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
            <TrendingUp size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">Select your current GPU above to see a personalized upgrade roadmap.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
