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
    subtype: "info",
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
    subtype: "error",
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
  const [selectedWorkItem, setSelectedWorkItem] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [logSearchTerm, setLogSearchTerm] = useState("");

  const handleSaveAnalysis = (data: any) => {
    console.log("Saving analysis:", data);
    // Implement save functionality
  };

  const filteredWorkItems = mockWorkItems.filter(item => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredLogs = mockLogs.filter(log => 
    log.payload.toLowerCase().includes(logSearchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-8">
        <FileUpload />
        
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
                  onView={() => setSelectedWorkItem(item.id)}
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
            
            <Tabs defaultValue="analysis-report">
              <TabsList>
                <TabsTrigger value="analysis-report">Analysis Report</TabsTrigger>
                <TabsTrigger value="test-description">Test Description</TabsTrigger>
                <TabsTrigger value="error-description">Error Description</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="correlation">Error Correlation</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis-report">
                <AnalysisReport
                  workItemId={selectedWorkItem}
                  onSave={handleSaveAnalysis}
                />
              </TabsContent>

              <TabsContent value="test-description">
                <TestDescription content={mockTestDescription} />
              </TabsContent>

              <TabsContent value="error-description">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Error Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {/* Add error description content */}
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="logs">
                <div className="space-y-4">
                  <Input
                    placeholder="Search logs..."
                    value={logSearchTerm}
                    onChange={(e) => setLogSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                  <LogViewer 
                    logs={filteredLogs}
                    errorTimestamp="2024-11-08T16:06:21"
                    timeWindow={30}
                  />
                </div>
              </TabsContent>

              <TabsContent value="correlation">
                <ErrorCorrelation workItemId={selectedWorkItem} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
