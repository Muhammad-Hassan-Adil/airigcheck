import React, { useState } from 'react';
import { Card } from '../../../components/common/Card';
import { Slider } from '../../../components/common/Slider';
import { Zap, X, Plus } from 'lucide-react';
import { ToolHeader } from '../../../components/common/ToolHeader';
import { GPUSearchSelector } from '../../../components/common/GPUSearchSelector';
import type { GPU } from '../../../types/database.types';
import { PageSEO } from '../../../components/seo/PageSEO';

const ELECTRICITY_RATES = [
  { id: 'us', label: 'US avg', rate: 0.12 },
  { id: 'eu', label: 'EU avg', rate: 0.28 },
  { id: 'uk', label: 'UK avg', rate: 0.29 },
  { id: 'au', label: 'Australia', rate: 0.25 },
  { id: 'custom', label: 'Custom', rate: 0.15 },
];

const COMMON_CPUS = [
  { name: 'Intel Core i5-13600K', watts: 125 },
  { name: 'Intel Core i7-13700K', watts: 125 },
  { name: 'Intel Core i9-13900K', watts: 253 },
  { name: 'Intel Core i9-14900K', watts: 253 },
  { name: 'AMD Ryzen 5 7600X', watts: 105 },
  { name: 'AMD Ryzen 7 7700X', watts: 105 },
  { name: 'AMD Ryzen 9 7900X', watts: 170 },
  { name: 'AMD Ryzen 9 7950X', watts: 170 },
  { name: 'AMD Ryzen 9 7950X3D', watts: 120 },
  { name: 'AMD Threadripper 7960X', watts: 350 },
  { name: 'AMD Threadripper 7980X', watts: 350 },
  { name: 'Intel Xeon W9-3595X', watts: 500 },
  { name: 'Custom CPU', watts: 125 },
];

interface PowerComponent {
  id: string;
  type: 'gpu' | 'cpu';
  name: string;
  watts: number;
  isEstimated?: boolean;
}

export const PowerCostCalculator: React.FC = () => {
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [rateId, setRateId] = useState('us');
  const [customRate, setCustomRate] = useState(0.12);
  
  const [components, setComponents] = useState<PowerComponent[]>([]);
  const [showGpuPicker, setShowGpuPicker] = useState(false);
  const [showCpuPicker, setShowCpuPicker] = useState(false);
  const [cpuSearch, setCpuSearch] = useState('');

  const getTdpForVram = (vram: number) => {
    if (vram >= 80) return 700;
    if (vram >= 48) return 450;
    if (vram >= 24) return 350;
    if (vram >= 16) return 200;
    if (vram >= 12) return 150;
    return 120;
  };

  const handleAddGpu = (gpu: GPU) => {
    const isEstimated = !gpu.tdp_watts;
    const watts = gpu.tdp_watts || getTdpForVram(gpu.vram_gb);
    
    setComponents([
      ...components,
      {
        id: `gpu-${Date.now()}`,
        type: 'gpu',
        name: gpu.name,
        watts,
        isEstimated
      }
    ]);
    setShowGpuPicker(false);
  };

  const handleAddCpu = (cpu: typeof COMMON_CPUS[0]) => {
    setComponents([
      ...components,
      {
        id: `cpu-${Date.now()}`,
        type: 'cpu',
        name: cpu.name,
        watts: cpu.watts,
        isEstimated: false
      }
    ]);
    setShowCpuPicker(false);
    setCpuSearch('');
  };

  const removeComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id));
  };

  const updateWatts = (id: string, newWatts: number) => {
    setComponents(components.map(c => c.id === id ? { ...c, watts: Math.max(0, newWatts) } : c));
  };

  const currentRate = rateId === 'custom' 
    ? customRate 
    : ELECTRICITY_RATES.find(r => r.id === rateId)?.rate || 0.12;

  const totalPower = components.length > 0 
    ? components.reduce((sum, item) => sum + item.watts, 0) + 40 
    : 0;

  // Costs (at 100% load during those hours)
  const kw = totalPower / 1000;
  const costPerHour = kw * currentRate;
  const costPerDay = costPerHour * hoursPerDay;
  const costPerMonth = costPerDay * 30.4; // avg days in month
  const costPerYear = costPerDay * 365;

  return (
    <Card className="p-6 overflow-visible">
      <PageSEO
        title="AI Rig Power & Electricity Cost Calculator | AIRigCheck"
        description="Calculate your AI workstation's power consumption and 24/7 electricity running costs. Estimate monthly spend by GPU configuration before committing to hardware."
        canonical="https://airigcheck.com/rig-configurator/power"
      />
      <ToolHeader
        icon={<Zap className="text-amber-500" size={24} />}
        title="Power & Cost Calculator"
        description="Estimate electricity costs for running your AI rig. Add your actual hardware components and set your local electricity rate."
        tip="Leave components you don't know blank — only added components are counted in the total."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Add Components</h4>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setShowGpuPicker(!showGpuPicker)} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1">
                <Plus size={14} /> Add GPU
              </button>
              <button onClick={() => setShowCpuPicker(!showCpuPicker)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md text-sm hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-colors flex items-center gap-1">
                <Plus size={14} /> Add CPU
              </button>
            </div>

            {showGpuPicker && (
              <div className="mb-6 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-900/10 relative z-20 overflow-visible">
                <div className="relative z-10">
                  <GPUSearchSelector
                    selectedGpu={null}
                    onSelect={handleAddGpu}
                    placeholder="Search and select GPU to add..."
                  />
                </div>
              </div>
            )}
            
            {showCpuPicker && (
              <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <input
                  type="text"
                  placeholder="Search CPUs..."
                  value={cpuSearch}
                  onChange={(e) => setCpuSearch(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-900 dark:text-white mb-3"
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {COMMON_CPUS.filter(c => c.name.toLowerCase().includes(cpuSearch.toLowerCase())).map(cpu => (
                    <button
                      key={cpu.name}
                      onClick={() => handleAddCpu(cpu)}
                      className="w-full text-left px-3 py-2 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-700 dark:text-slate-300 flex justify-between"
                    >
                      <span>{cpu.name}</span>
                      <span className="text-slate-500">{cpu.watts}W</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 mt-6">Added Components</h4>
            
            <div className="space-y-2 mb-4">
              {components.map(comp => (
                <div key={comp.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg gap-2">
                  <div className="flex items-center gap-2 max-w-[200px] sm:max-w-xs">
                    <span className="text-lg">
                      {comp.type === 'gpu' ? '🖥' : '⚙'}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 truncate" title={comp.name}>{comp.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {comp.type === 'gpu' ? (
                      <div className="flex flex-col items-end">
                        <span className="font-mono text-slate-900 dark:text-white">{comp.watts}W TDP</span>
                        {comp.isEstimated && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400">Estimated from VRAM class</span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={comp.watts || ''}
                          onChange={(e) => updateWatts(comp.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-right font-mono"
                        />
                        <span className="text-slate-500">W</span>
                      </div>
                    )}
                    <button onClick={() => removeComponent(comp.id)} className="text-slate-400 hover:text-red-500 p-1">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {components.length > 0 && (
                <div className="flex justify-between items-center text-sm p-3 bg-slate-100 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                  <span className="text-slate-500">🔌 Misc (fans, RAM, storage)</span>
                  <span className="text-slate-500 font-mono">40W (fixed)</span>
                </div>
              )}
              
              {components.length === 0 && (
                <div className="text-sm text-slate-500 italic p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center">
                  Add at least one component above to calculate power costs.
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span className="font-semibold text-slate-900 dark:text-white">Total Est. TDP</span>
              <span className="font-bold text-lg text-blue-600 dark:text-blue-400">{totalPower}W</span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Usage Pattern</h4>
            
            <Slider
              label="Hours per day active"
              min={1} max={24} step={1}
              value={hoursPerDay}
              onChange={setHoursPerDay}
              suffix="h"
            />
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Electricity Rate</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {ELECTRICITY_RATES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRateId(r.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${rateId === r.id ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              
              {rateId === 'custom' ? (
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Using ${currentRate}/kWh
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Cost Estimates</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-600 dark:text-slate-400">Per hour</span>
                <span className="text-xl font-semibold text-slate-900 dark:text-white">${costPerHour.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-600 dark:text-slate-400">Per day</span>
                <span className="text-xl font-semibold text-slate-900 dark:text-white">${costPerDay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-600 dark:text-slate-400">Per month</span>
                <span className="text-xl font-semibold text-slate-900 dark:text-white">${costPerMonth.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-slate-600 dark:text-slate-400">Per year</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${costPerYear.toFixed(0)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2 text-sm">
            <div className="flex justify-between items-center text-slate-500">
              <span>At 100% load (continuous training)</span>
              <span className="font-mono">${((totalPower/1000) * currentRate * 24 * 365).toFixed(0)}/yr</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>At 30% load (typical inference server)</span>
              <span className="font-mono">${((totalPower/1000 * 0.3) * currentRate * 24 * 365).toFixed(0)}/yr</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
