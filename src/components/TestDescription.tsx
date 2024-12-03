import React from "react";
import { Card } from "@/components/ui/card";

interface TestDescriptionProps {
  content: string;
}

export const TestDescription = ({ content }: TestDescriptionProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Test Description</h3>
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-md">
          {content}
        </pre>
      </div>
    </Card>
  );
};