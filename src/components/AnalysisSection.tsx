// frontend/src/components/AnalysisSection.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react";
import { AnalysisReport } from "@/components/AnalysisReport";
import { LogViewer } from "@/components/LogViewer";
import { ErrorCorrelation } from "@/components/ErrorCorrelation";
import { AgentOutput } from "@/components/AgentOutput"; // New Component
import { useToast } from "@/hooks/use-toast";

interface AnalysisSectionProps {
  workItemId: string;
  logs: any[];
  errorTimestamp?: string;
  onSaveAnalysis: (data: any) => void;
}

export const AnalysisSection = ({
  workItemId,
  logs,
  errorTimestamp,
  testDescription, // Receive prop
  errorDescription, // Receive prop
  onSaveAnalysis,
}: AnalysisSectionProps) => {
  const { toast } = useToast();
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [analysisReport, setAnalysisReport] = useState({
    targetGroup: "",
    errorTimestamp: "",
    rootCause: "",
    description: "",
  });
  const [agentOutput, setAgentOutput] = useState<any>(null);
  const [isRunningAgent, setIsRunningAgent] = useState(false);

  const handleGenerateAnalysis = async () => {
    try {
      setIsGeneratingAnalysis(true);
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ work_item_id: workItemId, testDescription, errorDescription }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate analysis: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisReport({
        targetGroup: data.target_group,
        errorTimestamp: data.error_timestamp,
        rootCause: data.root_cause,
        description: data.description,
      });

      toast({
        title: "Analysis Generated",
        description: "The AI analysis has been successfully generated.",
        variant: "success",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "error",
      });
    } finally {
      setIsGeneratingAnalysis(false);
    }
  };

  const handleRunAgent = async () => {
    try {
      setIsRunningAgent(true);

      // Define the input_text_prefix as per your requirements
      const inputTextPrefix = "Please follow these instructions with the goal \
                              of identifying and filtering specific DLT files related to a given error timestamp and find the error root cause. \
                              0. Elaborate and understand the error description reported between these tags  <error description></error description> \
                              1. Error Timestamp: First, ensure you have memorized the error timestamp provided in the input.  \
                              2. dlt file Search: Conduct a search within the specified folder and its subfolders: /workspaces/bmwtracing/backend/dlt_files/2064581/Octane_attachments_work_item_2064581_11-18-2024_10-53-08 \
                                 looking only for files with the extension .dlt, the file names contain a timestamp , it must falls within the range of 30 seconds before the recorded error timestamp up to the error timestamp itself \
                                 store the filtered list in a dlt_30.txt file \
                                 The naming convention for these files is as follows : YYYY-MM-DD_HH-MM-SS_YYYY-MM-DD_HH-MM-SS_VXXXXXX_XXXXXX_XXXXXX_XXXXXX_XXXXXX_VX_XXXX.dlt \
                              3. read the dlt_30.txt file, for each file utilize the /workspaces/bmwtracing/dlt-viewer/build/bin/dlt-viewer command to extract and display the logs looking for the error keyword  \
                                 include always the -t -s options for the execution and -c output.txt for dumping in a file the research \
                                 Command line usage: \
                                        Linux: /workspaces/bmwtracing/dlt-viewer/build/bin/dlt-viewer [OPTIONS] [logfile] [projectfile] [filterfile] \
                                        Options: \
                                        [logfile] Loading one or more logfiles on startup (must end with .dlt) \
                                        [projectfile] Loading project file on startup (must end with .dlp) \
                                        [filterfile] Loading filterfile on startup (must end with .dlf) \
                                        -h Print usage \
                                        -c textfile Convert logfile file to textfile \
                                        -u Conversion will be done in UTF8 instead of ASCII; \
                                        -csv Conversion will be done in CSV format; \
                                        -d Conversion will NOT be done, save in dlt file format again instead \
                                        -dd Conversion will NOT be done, save as decoded messages in dlt format \
                                        -b \"name of plugin|command in plugin|param1|..|param<n>\" Execute a plugin command with parameters before loading log file \
                                        -e \"name of plugin|command in plugin|param1|..|param<n>\" Execute a plugin command with parameters after loading log file \
                                        -s or --silent Enable silent mode without warning message boxes \
                                        -t or --terminate Terminate DLT Viewer after command line execution \
                                        -v or --version Only show version and buildtime information \
                                        -w workingdirectory Set the working directory \
                              4. parse the output.txt file and verify if you can find the error and the root cause and it's timestamp \
                              5. if the error root cause is not identified continue to analyze with DLT Viewer the next dlt file present in the dlt_30.txt file \
                              Output your findings in a structured format that clearly lists the identified DLT file where you found the error, the error timestamp and the reported error description in the log";

      
                                                      
      // ${filters} Construct the input_text by concatenating the prefix and descriptions
      const input_text = `${inputTextPrefix}  <error description> ${errorDescription} </error description>`;

      const response = await fetch("http://127.0.0.1:8000/run_agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to run agent: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setAgentOutput(data.data);
        toast({
          title: "Agent Execution Completed",
          description: "The Gen AI agent has successfully completed its analysis.",
          variant: "success",
        });
      } else {
        throw new Error(data.message || "Agent execution failed.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during agent execution.",
        variant: "error",
      });
    } finally {
      setIsRunningAgent(false);
    }
  };

  const handleZipUpload = (file: File) => {
    // Implement your ZIP upload logic here
    // For example, you might extract files or store the uploaded ZIP file
    console.log("ZIP File Uploaded:", file);
    toast({
      title: "ZIP File Uploaded",
      description: "The ZIP file has been uploaded successfully.",
      variant: "success",
    });
  };

  const handleDltFilesChange = (files: File[]) => {
    setDltFiles(files);
    // You can perform additional actions if needed
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Analysis</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateAnalysis}
            disabled={isGeneratingAnalysis}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {isGeneratingAnalysis ? "Generating Analysis..." : "Generate AI Analysis"}
          </Button>
          <Button
            onClick={handleRunAgent}
            disabled={isRunningAgent}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            {isRunningAgent ? "Running Agent..." : "Run Agent Analysis"}
          </Button>
        </div>
      </div>

      

      <Tabs defaultValue="report" className="w-full">
        <TabsList>
          <TabsTrigger value="report">Analysis Report</TabsTrigger>
          <TabsTrigger value="logs">Relevant Logs</TabsTrigger>
          <TabsTrigger value="correlation">Error Correlation</TabsTrigger>
          <TabsTrigger value="agent">Agent Output</TabsTrigger> {/* New Tab */}
        </TabsList>

        <TabsContent value="report">
          <AnalysisReport
            workItemId={workItemId}
            reportData={analysisReport} // Pass the analysis report data to AnalysisReport
            onSave={onSaveAnalysis}
            isGenerating={isGeneratingAnalysis}
          />
        </TabsContent>

        <TabsContent value="logs">
          <LogViewer
            logs={logs}
            errorTimestamp={analysisReport.errorTimestamp || errorTimestamp}
            timeWindow={30}
            isActive={true}
          />
        </TabsContent>

        <TabsContent value="correlation">
          <ErrorCorrelation workItemId={workItemId} />
        </TabsContent>

        <TabsContent value="agent">
          <AgentOutput
            data={agentOutput}
            isRunning={isRunningAgent}
            workItemId={workItemId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
