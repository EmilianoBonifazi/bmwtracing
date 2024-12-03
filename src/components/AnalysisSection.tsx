import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react";
import { AnalysisReport } from "@/components/AnalysisReport";
import { LogViewer } from "@/components/LogViewer";
import { ErrorCorrelation } from "@/components/ErrorCorrelation";

interface AnalysisSectionProps {
  workItemId: string;
  logs: any[];
  errorTimestamp?: string;
  isGeneratingAnalysis: boolean;
  onGenerateAnalysis: () => void;
  onSaveAnalysis: (data: any) => void;
}

export const AnalysisSection = ({
  workItemId,
  logs,
  errorTimestamp,
  isGeneratingAnalysis,
  onGenerateAnalysis,
  onSaveAnalysis
}: AnalysisSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Analysis</h2>
        <Button 
          onClick={onGenerateAnalysis}
          disabled={isGeneratingAnalysis}
          className="flex items-center gap-2"
        >
          <Wand2 className="h-4 w-4" />
          {isGeneratingAnalysis ? "Generating Analysis..." : "Generate AI Analysis"}
        </Button>
      </div>

      <Tabs defaultValue="report" className="w-full">
        <TabsList>
          <TabsTrigger value="report">Analysis Report</TabsTrigger>
          <TabsTrigger value="logs">Relevant Logs</TabsTrigger>
          <TabsTrigger value="correlation">Error Correlation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="report">
          <AnalysisReport
            workItemId={workItemId}
            onSave={onSaveAnalysis}
            onGenerateAIAnalysis={onGenerateAnalysis}
            isGenerating={isGeneratingAnalysis}
          />
        </TabsContent>
        
        <TabsContent value="logs">
          <LogViewer
            logs={logs}
            errorTimestamp={errorTimestamp}
            timeWindow={30}
            isActive={true}
          />
        </TabsContent>
        
        <TabsContent value="correlation">
          <ErrorCorrelation workItemId={workItemId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};