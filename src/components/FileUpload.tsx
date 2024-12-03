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
    <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".zip"
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="bg-primary hover:bg-primary/90 flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Upload ZIP
      </Button>
    </div>
  );
};