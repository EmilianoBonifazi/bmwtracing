import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LogEntry {
  index: number;
  time: string;
  timestamp: string;
  count: number;
  ecuid: string;
  apid: string;
  ctid: string;
  sessionId: string;
  type: string;
  subtype: "info" | "error" | "warning";
  mode: string;
  args: number;
  payload: string;
}

interface LogViewerProps {
  logs: LogEntry[];
}

export const LogViewer = ({ logs }: LogViewerProps) => {
  return (
    <Card className="p-4 bg-gray-900 text-white font-mono text-sm overflow-x-auto">
      <div className="space-y-1">
        {logs.map((log) => (
          <div
            key={log.index}
            className={cn(
              "py-1",
              log.subtype === "error" && "text-red-400",
              log.subtype === "warning" && "text-yellow-400",
              log.subtype === "info" && "text-blue-400"
            )}
          >
            <span className="text-gray-500">{log.time}</span>{" "}
            <span className="text-gray-400">[{log.sessionId}]</span>{" "}
            <span className="uppercase text-xs">[{log.subtype}]</span>{" "}
            {log.payload}
          </div>
        ))}
      </div>
    </Card>
  );
};