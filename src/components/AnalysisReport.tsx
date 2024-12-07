// frontend/src/components/AnalysisReport.tsx

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisReportProps {
  workItemId: string;
  reportData: {
    targetGroup: string;
    errorTimestamp: string;
    rootCause: string;
    description: string;
  };
  onSave: (data: any) => void;
  isGenerating: boolean;
}

export const AnalysisReport = ({
  workItemId,
  reportData,
  onSave,
  isGenerating,
}: AnalysisReportProps) => {
  const { toast } = useToast();
  const [report, setReport] = useState(reportData);

  // Sync local state with reportData prop
  useEffect(() => {
    setReport(reportData);
  }, [reportData]);

  const handleSaveAsPDF = () => {
    // Implement your PDF generation logic here
    // For example, you can use libraries like jsPDF or html2canvas
    // Below is a simple example using jsPDF

    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.jsPDF();

      doc.setFontSize(16);
      doc.text(`Analysis Report - Work Item #${workItemId}`, 10, 10);

      doc.setFontSize(12);
      doc.text(`Target Group: ${report.targetGroup}`, 10, 20);
      doc.text(`Issue event Timestamp: ${report.errorTimestamp}`, 10, 30);
      doc.text(`Issue event: ${report.rootCause}`, 10, 40);
      doc.text("Description:", 10, 50);
      doc.text(report.description, 10, 60);

      doc.save(`Analysis_Report_Work_Item_${workItemId}.pdf`);

      toast({
        title: "Report Saved",
        description: "Analysis report has been saved as PDF.",
      });

      onSave(report);
    }).catch((error) => {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        variant: "destructive",
      });
    });
  };

  const handleSendToTargetGroup = () => {
    if (!report.targetGroup) {
      toast({
        title: "Error",
        description: "Please select a target group first.",
        variant: "destructive",
      });
      return;
    }

    // Implement your send logic here
    // This could involve making an API call to send the report to the selected target group
    // For demonstration, we'll assume it's a successful operation

    // Example:
    /*
    fetch("http://127.0.0.1:8000/send_report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ work_item_id: workItemId, target_group: report.targetGroup }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to send report.");
        }
        return response.json();
      })
      .then(data => {
        toast({
          title: "Work Item Sent",
          description: `Work item has been sent to ${report.targetGroup}.`,
        });
      })
      .catch(error => {
        console.error(error);
        toast({
          title: "Error",
          description: error.message || "Failed to send report.",
          variant: "destructive",
        });
      });
    */

    // For now, we'll simulate a successful send
    toast({
      title: "Work Item Sent",
      description: `Work item has been sent to ${report.targetGroup}.`,
      variant: "success",
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Analysis Report - Work Item #{workItemId}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target Group</label>
          <Select
            value={report.targetGroup}
            onValueChange={(value) => setReport({ ...report, targetGroup: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select target group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Networking Team">Networking Team</SelectItem>
              <SelectItem value="Hardware Team">Hardware Team</SelectItem>
              <SelectItem value="Software Team">Software Team</SelectItem>
              <SelectItem value="Integration Team">Integration Team</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Issue Timestamp</label>
          <input
            type="datetime-local"
            value={report.errorTimestamp}
            onChange={(e) =>
              setReport({ ...report, errorTimestamp: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Issue event</label>
          <Textarea
            value={report.rootCause}
            onChange={(e) => setReport({ ...report, rootCause: e.target.value })}
            placeholder="Describe the identified Issue event..."
            className="h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={report.description}
            onChange={(e) => setReport({ ...report, description: e.target.value })}
            placeholder="Additional analysis details..."
            className="h-32"
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleSaveAsPDF}
            className="flex-1 flex items-center gap-2"
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
            Save as PDF
          </Button>
          <Button
            onClick={handleSendToTargetGroup}
            className="flex-1 flex items-center gap-2"
            disabled={isGenerating}
          >
            <Send className="h-4 w-4" />
            Send to Target Group
          </Button>
        </div>
      </div>
    </Card>
  );
};
