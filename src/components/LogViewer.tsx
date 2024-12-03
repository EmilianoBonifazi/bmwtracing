import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LogEntry {
  timestamp: string;
  level: "info" | "error" | "warning";
  message: string;
}

interface LogViewerProps {
  logs: LogEntry[];
}

export const LogViewer = ({ logs }: LogViewerProps) => {
  return (
    <Card className="p-4 bg-gray-900 text-white font-mono text-sm overflow-x-auto">
      <div className="space-y-1">
        {logs.map((log, index) => (
          <div
            key={index}
            className={cn(
              "py-1",
              log.level === "error" && "text-red-400",
              log.level === "warning" && "text-yellow-400",
              log.level === "info" && "text-blue-400"
            )}
          >
            <span className="text-gray-500">{log.timestamp}</span>{" "}
            <span className="uppercase text-xs">[{log.level}]</span>{" "}
            {log.message}
          </div>
        ))}
      </div>
    </Card>
  );
};