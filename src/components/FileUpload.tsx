import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export const FileUpload = () => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/zip") {
      toast({
        title: "File uploaded successfully",
        description: `Processing ${file.name}...`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a ZIP file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip"
        className="hidden"
      />
      <Upload className="h-12 w-12 text-gray-400 mb-4" />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="bg-primary hover:bg-primary/90"
      >
        Upload ZIP File
      </Button>
      <p className="mt-2 text-sm text-gray-500">
        Upload a ZIP file containing diagnostic data
      </p>
    </div>
  );
};