import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  errorTimestamp?: string;
  timeWindow?: number;
  isActive: boolean;
}

export const LogViewer = ({ logs, errorTimestamp, timeWindow = 30, isActive }: LogViewerProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.payload.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (errorTimestamp && timeWindow) {
      const errorTime = new Date(errorTimestamp).getTime();
      const logTime = new Date(log.timestamp).getTime();
      const withinWindow = Math.abs(errorTime - logTime) <= timeWindow * 1000;
      return matchesSearch && withinWindow;
    }
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 3: Review Relevant Logs</h3>
      <Input
        placeholder="Search logs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
      <Card className={`p-4 bg-gray-900 text-white font-mono text-sm overflow-x-auto ${isActive ? 'ring-2 ring-primary' : ''}`}>
        <div className="space-y-1">
          {filteredLogs.map((log) => (
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
    </div>
  );
};