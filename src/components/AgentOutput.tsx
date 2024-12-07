// frontend/src/components/AgentOutput.tsx

import React from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner"; // Ensure you have a Spinner component

interface AgentOutputProps {
  data: any;
  isRunning: boolean;
  workItemId: string;
}

export const AgentOutput = ({ data, isRunning, workItemId }: AgentOutputProps) => {
  if (isRunning) {
    return (
      <Card className="p-6 flex items-center justify-center">
        <Spinner className="h-6 w-6 mr-2" />
        <span>Agent Analysis is running...</span>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-6">
        <p>No agent output available. Please run the agent analysis.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">Gen AI Agent Output for Work Item #{workItemId}</h3>
      <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      {/* You can further customize how the data is displayed */}
    </Card>
  );
};
