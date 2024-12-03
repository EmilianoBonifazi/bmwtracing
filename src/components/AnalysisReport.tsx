import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AnalysisReportProps {
  workItemId: string;
  initialData?: {
    targetGroup?: string;
    errorTimestamp?: string;
    rootCause?: string;
    description?: string;
  };
  onSave: (data: any) => void;
}

export const AnalysisReport = ({ workItemId, initialData, onSave }: AnalysisReportProps) => {
  const [reportData, setReportData] = useState({
    targetGroup: initialData?.targetGroup || "",
    errorTimestamp: initialData?.errorTimestamp || "",
    rootCause: initialData?.rootCause || "",
    description: initialData?.description || "",
  });

  const handleSave = () => {
    onSave(reportData);
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold mb-4">Analysis Report - Work Item #{workItemId}</h3>
      
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
          <Input
            type="datetime-local"
            value={reportData.errorTimestamp}
            onChange={(e) => setReportData({ ...reportData, errorTimestamp: e.target.value })}
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

        <Button onClick={handleSave} className="w-full">
          Save Analysis Report
        </Button>
      </div>
    </Card>
  );
};