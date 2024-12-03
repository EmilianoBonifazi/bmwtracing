import React, { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload, Plus, FileText, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const FileUpload = () => {
  const { toast } = useToast();
  const [dltFiles, setDltFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const dltFiles = files.filter(file => file.name.endsWith('.dlt'));
    
    if (dltFiles.length > 0) {
      setDltFiles(prev => [...prev, ...dltFiles]);
      toast({
        title: "DLT files added",
        description: `Added ${dltFiles.length} DLT files for analysis`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload .dlt files",
        variant: "destructive",
      });
    }
  };

  const handleZipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const zipFile = files[0];
    
    if (zipFile && zipFile.name.endsWith('.zip')) {
      toast({
        title: "ZIP file uploaded",
        description: "The ZIP file will be processed for analysis",
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setDltFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      <Tabs defaultValue="individual" className="w-full">
        <TabsList>
          <TabsTrigger value="individual">Individual Files</TabsTrigger>
          <TabsTrigger value="zip">ZIP Upload</TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upload DLT Files</h3>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add DLT Files
              </Button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".dlt"
              multiple
              className="hidden"
            />
            
            {dltFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-white">
                {dltFiles.map((file, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    <FileText className="h-4 w-4" />
                    {file.name}
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="zip">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Upload ZIP File</h3>
              <Button
                onClick={() => zipInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                Upload ZIP
              </Button>
            </div>
            
            <input
              type="file"
              ref={zipInputRef}
              onChange={handleZipUpload}
              accept=".zip"
              className="hidden"
            />
            
            <p className="text-sm text-gray-600">
              Upload a ZIP file containing DLT files, test description, and error description.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};