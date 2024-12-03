import React, { useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface FileUploadProps {
  dltFiles: File[];
  onDltFilesChange: (files: File[]) => void;
}

export const FileUpload = ({ dltFiles, onDltFilesChange }: FileUploadProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const dltFiles = files.filter(file => file.name.endsWith('.dlt'));
    
    if (dltFiles.length > 0) {
      onDltFilesChange(dltFiles);
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

  const removeFile = (index: number) => {
    const updatedFiles = dltFiles.filter((_, i) => i !== index);
    onDltFilesChange(updatedFiles);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">DLT Files</h3>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload DLT Files
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
    </Card>
  );
};