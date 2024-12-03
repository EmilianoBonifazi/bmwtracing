import React from "react";
import { Card } from "@/components/ui/card";

interface ErrorCorrelationProps {
  workItemId: string;
}

export const ErrorCorrelation = ({ workItemId }: ErrorCorrelationProps) => {
  // Mock correlated errors
  const correlatedErrors = [
    {
      id: "2063490",
      similarity: 0.89,
      description: "VLAN mismatch in MARS-IDCevo communication",
      resolution: "Updated VLAN configuration in network settings"
    },
    {
      id: "2063485",
      similarity: 0.75,
      description: "Network timeout between MARS and IDCevo",
      resolution: "Increased timeout threshold in communication protocol"
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Error Correlation Analysis</h3>
      <div className="space-y-4">
        {correlatedErrors.map((error) => (
          <div key={error.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium">Work Item #{error.id}</span>
              <span className="text-sm text-gray-500">
                {(error.similarity * 100).toFixed(0)}% similar
              </span>
            </div>
            <p className="text-gray-700 mb-2">{error.description}</p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Resolution: </span>
              {error.resolution}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};