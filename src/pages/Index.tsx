import React from "react";
import { Layout } from "@/components/Layout";
import { FileUpload } from "@/components/FileUpload";
import { WorkItemCard } from "@/components/WorkItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogViewer } from "@/components/LogViewer";
import { TestDescription } from "@/components/TestDescription";

// Mock data for demonstration
const mockWorkItems = [
  { id: "2063495", status: "completed" as const },
  { id: "2063496", status: "processing" as const },
];

const mockLogs = [
  { timestamp: "2024-02-14 10:15:23", level: "info" as const, message: "System startup" },
  { timestamp: "2024-02-14 10:15:24", level: "error" as const, message: "Communication error: VLAN mismatch" },
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
  const [selectedWorkItem, setSelectedWorkItem] = React.useState<string | null>(null);

  return (
    <Layout>
      <div className="space-y-8">
        <FileUpload />
        
        {!selectedWorkItem ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWorkItems.map((item) => (
              <WorkItemCard
                key={item.id}
                {...item}
                onView={() => setSelectedWorkItem(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedWorkItem(null)}
              className="text-primary hover:underline flex items-center"
            >
              ← Back to Work Items
            </button>
            
            <Tabs defaultValue="test-description">
              <TabsList>
                <TabsTrigger value="test-description">Test Description</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="report">Analysis Report</TabsTrigger>
              </TabsList>
              
              <TabsContent value="test-description">
                <TestDescription content={mockTestDescription} />
              </TabsContent>
              
              <TabsContent value="logs">
                <LogViewer logs={mockLogs} />
              </TabsContent>
              
              <TabsContent value="report">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Analysis Report</h3>
                  <p className="text-gray-600">
                    Report content will be generated using LLM analysis...
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;