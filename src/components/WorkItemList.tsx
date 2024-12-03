import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkItemCard } from "@/components/WorkItemCard";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const mockWorkItems = [
  { id: "2063495", status: "completed" as const },
  { id: "2063496", status: "processing" as const },
  { id: "2063497", status: "error" as const },
  { id: "2063498", status: "completed" as const },
  { id: "2063499", status: "error" as const },
];

export const WorkItemList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredWorkItems = mockWorkItems.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewWorkItem = (id: string) => {
    navigate(`/work-item/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search work items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkItems.map((item) => (
          <WorkItemCard
            key={item.id}
            id={item.id}
            status={item.status}
            onView={() => handleViewWorkItem(item.id)}
          />
        ))}
      </div>
    </div>
  );
};