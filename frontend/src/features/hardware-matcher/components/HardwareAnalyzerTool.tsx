import React from 'react';
import { GPUSelector } from './GPUSelector';
import { ModelSelector } from './ModelSelector';
import { VRAMBarGraph } from './VRAMBarGraph';
import { PerformanceEstimator } from './PerformanceEstimator';
import { useHardwareMatcher } from '../hooks/useHardwareMatcher';
import { ToolHeader } from '../../../components/common/ToolHeader';
import { Cpu } from 'lucide-react';

export const HardwareAnalyzerTool: React.FC = () => {
  const { request: hwRequest, updateRequest: updateHwRequest, result: hwResult } = useHardwareMatcher();

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={<Cpu className="text-blue-500" size={24} />}
        title="GPU Compatibility Checker"
        description="Check if your GPU has enough VRAM to run a specific LLM. Adjust model size, quantization, and context length to see VRAM requirements in real time."
        tip="Lower quantization (4-bit vs 16-bit) drastically reduces VRAM usage with minimal quality loss for most tasks."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <GPUSelector request={hwRequest} updateRequest={updateHwRequest} />
        <ModelSelector request={hwRequest} updateRequest={updateHwRequest} />
      </div>
      <div className="space-y-6">
        <VRAMBarGraph result={hwResult} />
        <PerformanceEstimator result={hwResult} />
      </div>
      </div>
    </div>
  );
};
