import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { WorkItemCard } from "@/components/WorkItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogViewer } from "@/components/LogViewer";
import { TestDescription } from "@/components/TestDescription";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorCorrelation } from "@/components/ErrorCorrelation";
import { AnalysisReport } from "@/components/AnalysisReport";
import { useToast } from "@/hooks/use-toast";

const mockWorkItems = [
  { id: "2063495", status: "completed" as const },
  { id: "2063496", status: "processing" as const },
  { id: "2063497", status: "error" as const },
];

const mockLogs = [
  { 
    index: 67,
    time: "59:58.7",
    timestamp: "1144.8241",
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
    timestamp: "1144.8244",
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

const mockTestDescription = `Test Case ID: TC_NETWORK_001
Description: Verify network communication between MARS and IDCevo modules
Prerequisites: 
- All systems operational
- Network connections established

Steps:
1. Initialize MARS module
2. Start IDCevo communication
3. Verify packet transmission
4. Check response times`;

const Index = () => {
  const { toast } = useToast();
  const [selectedWorkItem, setSelectedWorkItem] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [logSearchTerm, setLogSearchTerm] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);

  const handleSaveAnalysis = (data: any) => {
    console.log("Saving analysis:", data);
    toast({
      title: "Analysis saved",
      description: "The analysis report has been saved successfully.",
    });
  };

  const handleGenerateAIAnalysis = async () => {
    setIsGeneratingAnalysis(true);
    // Simulate AI analysis generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingAnalysis(false);
    toast({
      title: "AI Analysis Complete",
      description: "The analysis has been generated based on the test description and logs.",
    });
  };

  const filteredWorkItems = mockWorkItems.filter(item => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Layout>
      <div className="space-y-8">
        {!selectedWorkItem ? (
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Search work items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkItems.map((item) => (
                <WorkItemCard
                  key={item.id}
                  {...item}
                  onView={() => {
                    setSelectedWorkItem(item.id);
                    setCurrentStep(1);
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedWorkItem(null)}
              className="text-primary hover:underline flex items-center"
            >
              ← Back to Work Items
            </button>
            
            <div className="space-y-8">
              <FileUpload />
              
              <TestDescription 
                content={mockTestDescription} 
                isActive={currentStep === 2}
              />
              
              <LogViewer 
                logs={mockLogs}
                errorTimestamp="2024-11-08T16:06:21"
                timeWindow={30}
                isActive={currentStep === 3}
              />
              
              <AnalysisReport
                workItemId={selectedWorkItem}
                onSave={handleSaveAnalysis}
                onGenerateAIAnalysis={handleGenerateAIAnalysis}
                isGenerating={isGeneratingAnalysis}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;