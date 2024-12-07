// frontend/src/components/WorkItemDetail.tsx

import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { InputSources } from "@/components/InputSources";
import { AnalysisSection } from "@/components/AnalysisSection";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const WorkItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testDescription, setTestDescription] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [dltFiles, setDltFiles] = useState<File[]>([]);

  // Fetch work item data
  const { data: workItem, isLoading } = useQuery({
    queryKey: ['workItem', id],
    queryFn: async () => {
      // For now, return mock data since we don't have a real API
      return {
        id,
        title: `Work Item #${id}`,
        status: 'open',
      };
    },
  });

  const handleSaveAnalysis = async (data: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Analysis saved",
        description: "The analysis report has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleZipUpload = async (file: File) => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "ZIP file uploaded",
        description: "The ZIP file will be processed for analysis",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload ZIP file. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Mock logs (replace with real logs as needed)
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
      payload: "[ AntennaControlExt : 1053 : 27937 ] checkAntennaStatusExt: antenna_mode[1], [pre_fault_cnt(-128)] [cur_antenna_dtc(0)], [pre_antenna_dtc(0)]",
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
      payload: "[ SystemHal : 1053 : 27937 ] sl_hal_get_dtc_antenna_status: antenna_mode 5 antenna_adc 0 ret 0",
    },
  ];

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
          onZipUpload={handleZipUpload}
        />
        
        <AnalysisSection
          workItemId={id || ""}
          logs={mockLogs}
          errorTimestamp="2024-03-15T11:44:58.744"
          testDescription={testDescription} // Pass test description
          errorDescription={errorDescription} // Pass error description
          onSaveAnalysis={handleSaveAnalysis}
        />
      </div>
    </Layout>
  );
};

export default WorkItemDetail;
