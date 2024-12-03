import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisReportProps {
  workItemId: string;
  initialData?: {
    targetGroup?: string;
    errorTimestamp?: string;
    rootCause?: string;
    description?: string;
  };
  onSave: (data: any) => void;
  isGenerating: boolean;
}

export const AnalysisReport = ({ 
  workItemId, 
  initialData,
  onSave,
  isGenerating 
}: AnalysisReportProps) => {
  const { toast } = useToast();
  const [reportData, setReportData] = useState({
    targetGroup: initialData?.targetGroup || "",
    errorTimestamp: initialData?.errorTimestamp || "",
    rootCause: initialData?.rootCause || "",
    description: initialData?.description || "",
  });

  const handleSaveAsPDF = () => {
    // Mock PDF generation
    toast({
      title: "Report Saved",
      description: "Analysis report has been saved as PDF",
    });
    onSave(reportData);
  };

  const handleSendToTargetGroup = () => {
    if (!reportData.targetGroup) {
      toast({
        title: "Error",
        description: "Please select a target group first",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Work Item Sent",
      description: `Work item has been sent to ${reportData.targetGroup}`,
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analysis Report - Work Item #{workItemId}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target Group</label>
          <Select
            value={reportData.targetGroup}
            onValueChange={(value) => setReportData({ ...reportData, targetGroup: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="networking">Networking Team</SelectItem>
              <SelectItem value="hardware">Hardware Team</SelectItem>
              <SelectItem value="software">Software Team</SelectItem>
              <SelectItem value="integration">Integration Team</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Error Timestamp</label>
          <input
            type="datetime-local"
            value={reportData.errorTimestamp}
            onChange={(e) => setReportData({ ...reportData, errorTimestamp: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Root Cause</label>
          <Textarea
            value={reportData.rootCause}
            onChange={(e) => setReportData({ ...reportData, rootCause: e.target.value })}
            placeholder="Describe the identified root cause..."
            className="h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={reportData.description}
            onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
            placeholder="Additional analysis details..."
            className="h-32"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSaveAsPDF} className="flex-1 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Save as PDF
          </Button>
          <Button onClick={handleSendToTargetGroup} className="flex-1 flex items-center gap-2">
            <Send className="h-4 w-4" />
            Send to Target Group
          </Button>
        </div>
      </div>
    </Card>
  );
};