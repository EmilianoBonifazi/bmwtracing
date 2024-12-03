import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { InputSources } from "@/components/InputSources";
import { AnalysisSection } from "@/components/AnalysisSection";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const WorkItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testDescription, setTestDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Work Items
          </Button>
          <h1 className="text-2xl font-bold">Work Item #{id}</h1>
        </div>

        <InputSources
          testDescription={testDescription}
          errorDescription={errorDescription}
          onTestDescriptionChange={setTestDescription}
          onErrorDescriptionChange={setErrorDescription}
          dltFiles={dltFiles}
          onDltFilesChange={setDltFiles}
        />
        
        <AnalysisSection
          workItemId={id || ""}
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
  }
];

export default WorkItemDetail;