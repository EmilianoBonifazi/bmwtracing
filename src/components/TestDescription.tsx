import React from "react";
import { Card } from "@/components/ui/card";

interface TestDescriptionProps {
  content: string;
  isActive: boolean;
}

export const TestDescription = ({ content, isActive }: TestDescriptionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Step 2: Review Test Description</h3>
      <Card className={`p-6 ${isActive ? 'ring-2 ring-primary' : ''}`}>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
            {content}
          </pre>
        </div>
      </Card>
    </div>
  );
};