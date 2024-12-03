import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, File, AlertCircle } from "lucide-react";

interface WorkItemProps {
  id: string;
  status: "processing" | "completed" | "error";
  onView: () => void;
}

export const WorkItemCard = ({ id, status, onView }: WorkItemProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">Work Item #{id}</h3>
          <div className="flex items-center mt-1">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full mr-2",
                status === "completed" && "bg-green-500",
                status === "processing" && "bg-blue-500",
                status === "error" && "bg-red-500"
              )}
            />
            <span className="text-sm text-gray-600 capitalize">{status}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <FileText className="h-4 w-4 mr-2" />
          <span>ErrorDescription.txt</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <File className="h-4 w-4 mr-2" />
          <span>Octane_attachments.zip</span>
        </div>
      </div>
      <Button
        onClick={onView}
        className="w-full mt-4"
        variant="outline"
      >
        View Details
      </Button>
    </Card>
  );
};