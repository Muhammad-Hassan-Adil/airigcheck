import React from 'react';
import { HardwareBuilder } from './HardwareBuilder';
import { VRAMBarGraph } from './VRAMBarGraph';
import { AutoRecommender } from './AutoRecommender';
import { useHardwareMatcher } from '../hooks/useHardwareMatcher';
import { ToolHeader } from '../../../components/common/ToolHeader';
import { Server } from 'lucide-react';

export const RigConfiguratorTool: React.FC = () => {
  const { request: hwRequest, result: hwResult, hardwareItems, addHardwareItem, updateHardwareItem, removeHardwareItem } = useHardwareMatcher();

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={<Server className="text-purple-500" size={24} />}
        title="Rig Builder"
        description="Stack multiple GPUs and RAM to calculate your total VRAM pool. The auto-recommender suggests the best models for your combined hardware."
        tip="Use 'Other (Fetch Live)' to look up any GPU not in our database — it fetches specs automatically."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <HardwareBuilder 
          hardwareItems={hardwareItems}
          addHardwareItem={addHardwareItem}
          updateHardwareItem={updateHardwareItem}
          removeHardwareItem={removeHardwareItem}
          totalVram={hwRequest.gpuVramGb}
        />
      </div>
      <div className="space-y-6">
        <VRAMBarGraph result={hwResult} />
        <AutoRecommender baseHardware={hwRequest} />
      </div>
      </div>
    </div>
  );
};
