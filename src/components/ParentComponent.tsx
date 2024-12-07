// frontend/src/components/ParentComponent.tsx

import React, { useState } from "react";
import { AnalysisSection } from "@/components/AnalysisSection";

interface ParentComponentProps {
  workItemId: string;
  logs: any[];
  errorTimestamp?: string;
}

export const ParentComponent = ({
  workItemId,
  logs,
  errorTimestamp,
}: ParentComponentProps) => {
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [savedAnalysis, setSavedAnalysis] = useState<any>(null);

  const handleGenerateAnalysis = () => {
    setIsGeneratingAnalysis(true);
  };

  const handleSaveAnalysis = (data: any) => {
    setSavedAnalysis(data);
    // Implement your save logic here, e.g., send to backend or download
  };

  return (
    <AnalysisSection
      workItemId={workItemId}
      logs={logs}
      errorTimestamp={errorTimestamp}
      isGeneratingAnalysis={isGeneratingAnalysis}
      onGenerateAnalysis={handleGenerateAnalysis}
      onSaveAnalysis={handleSaveAnalysis}
    />
  );
};
