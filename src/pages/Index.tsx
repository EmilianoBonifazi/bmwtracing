import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { InputSources } from "@/components/InputSources";
import { AnalysisSection } from "@/components/AnalysisSection";
import { useToast } from "@/hooks/use-toast";

const mockLogs = [
  { 
    index: 67,
    time: "59:58.7",
    timestamp: "2024-03-15T11:44:58.724",
    count: 98,
    ecuid: "INAD",
    apid: "ANTN",
    ctid: "ANTN",
    sessionId: "1053",
    type: "log",
    subtype: "info" as const,
    mode: "verbose",
    args: 8,
    payload: "[ AntennaControlExt : 1053 : 27937 ] checkAntennaStatusExt: antenna_mode[1], [pre_fault_cnt(-128)] [cur_antenna_dtc(0)], [pre_antenna_dtc(0)]"
  },
  {
    index: 69,
    time: "59:58.7",
    timestamp: "2024-03-15T11:44:58.744",
    count: 100,
    ecuid: "INAD",
    apid: "ANTN",
    ctid: "ANTN",
    sessionId: "1053",
    type: "log",
    subtype: "error" as const,
    mode: "verbose",
    args: 8,
    payload: "[ SystemHal : 1053 : 27937 ] sl_hal_get_dtc_antenna_status: antenna_mode 5 antenna_adc 0 ret 0"
  },
  {
    index: 70,
    time: "59:58.8",
    timestamp: "2024-03-15T11:44:58.824",
    count: 101,
    ecuid: "INAD",
    apid: "DIAG",
    ctid: "DIAG",
    sessionId: "1053",
    type: "log",
    subtype: "warning" as const,
    mode: "verbose",
    args: 8,
    payload: "[ DiagnosticManager : 1053 : 27937 ] Diagnostic check failed: Network connectivity issues detected"
  }
];

const Index = () => {
  const { toast } = useToast();
  const [testDescription, setTestDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [selectedWorkItem] = useState("2063495");
  const [analysisGenerated, setAnalysisGenerated] = useState(false);
  const [dltFiles, setDltFiles] = useState<File[]>([]);

  const handleGenerateAnalysis = async () => {
    setIsGeneratingAnalysis(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingAnalysis(false);
    setAnalysisGenerated(true);
    toast({
      title: "Analysis Generated",
      description: "The AI analysis has been completed successfully.",
    });
  };

  const handleSaveAnalysis = (data: any) => {
    console.log("Saving analysis:", data);
    toast({
      title: "Analysis saved",
      description: "The analysis report has been saved successfully.",
    });
  };

  const handleZipUpload = (file: File) => {
    console.log("Processing ZIP file:", file);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <InputSources
          testDescription={testDescription}
          errorDescription={errorDescription}
          onTestDescriptionChange={setTestDescription}
          onErrorDescriptionChange={setErrorDescription}
          onZipUpload={handleZipUpload}
          dltFiles={dltFiles}
          onDltFilesChange={setDltFiles}
        />
        
        <AnalysisSection
          workItemId={selectedWorkItem}
          logs={analysisGenerated ? mockLogs : []}
          errorTimestamp="2024-03-15T11:44:58.744"
          isGeneratingAnalysis={isGeneratingAnalysis}
          onGenerateAnalysis={handleGenerateAnalysis}
          onSaveAnalysis={handleSaveAnalysis}
        />
      </div>
    </Layout>
  );
};

export default Index;