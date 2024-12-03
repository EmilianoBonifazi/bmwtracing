import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface InputSourcesProps {
  testDescription: string;
  errorDescription: string;
  onTestDescriptionChange: (value: string) => void;
  onErrorDescriptionChange: (value: string) => void;
  onZipUpload: (file: File) => void;
}

export const InputSources = ({
  testDescription,
  errorDescription,
  onTestDescriptionChange,
  onErrorDescriptionChange,
  onZipUpload
}: InputSourcesProps) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleZipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const zipFile = files[0];
    
    if (zipFile && zipFile.name.endsWith('.zip')) {
      onZipUpload(zipFile);
      toast({
        title: "ZIP file uploaded",
        description: "The ZIP file will be processed for analysis",
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file containing DLT, test, and error files",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Input Sources</h2>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleZipUpload}
            accept=".zip"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            Upload ZIP Package
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dlt" className="w-full">
        <TabsList>
          <TabsTrigger value="dlt">DLT Files</TabsTrigger>
          <TabsTrigger value="test">Test Description</TabsTrigger>
          <TabsTrigger value="error">Error Description</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dlt">
          <FileUpload />
        </TabsContent>
        
        <TabsContent value="test">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Test Description</h3>
            <Textarea
              value={testDescription}
              onChange={(e) => onTestDescriptionChange(e.target.value)}
              className="min-h-[200px]"
              placeholder="Enter or paste test description here..."
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="error">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Error Description</h3>
            <Textarea
              value={errorDescription}
              onChange={(e) => onErrorDescriptionChange(e.target.value)}
              className="min-h-[200px]"
              placeholder="Enter or paste error description here..."
            />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};