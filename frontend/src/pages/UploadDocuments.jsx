import React, { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  ArrowLeft,
  File,
  Trash2,
} from "lucide-react";
import Header from "../components/navigation/Header";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { uploadPrescription } from "../lib/api";

export default function UploadDocuments({ abhaId, onBack, onComplete }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({}); // { [fileName]: 'uploading' | 'success' | 'error' }
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setFiles((prev) => [...prev, ...imageFiles]);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const uploadFile = async (file) => {
    try {
      const result = await uploadPrescription({ file, abhaId });
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUploadAll = async () => {
    setUploading(true);
    const newStatus = {};

    for (const file of files) {
      newStatus[file.name] = "uploading";
      setUploadStatus({ ...newStatus });

      try {
        await uploadFile(file);
        newStatus[file.name] = "success";
      } catch (error) {
        newStatus[file.name] = "error";
        console.error(`Failed to upload ${file.name}:`, error);
      }

      setUploadStatus({ ...newStatus });
    }

    setUploading(false);

    // If all successful, redirect after a moment
    const allSuccess = Object.values(newStatus).every((s) => s === "success");
    if (allSuccess) {
      setTimeout(() => onComplete(), 2000);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type === "application/pdf") return FileText;
    return File;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <Header status="Upload Documents" showEmergency={false} />

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
        <div className="mb-6 flex items-center gap-4 animate-fade-slide-up">
          <button
            onClick={onBack}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-text-secondary transition-all hover:border-primary hover:text-primary hover:bg-primary-soft"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Upload Medical Documents</h1>
            <p className="text-sm text-text-secondary mt-1">
              Add prescriptions, reports, and medical records to your timeline
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="mb-6 animate-fade-slide-up" style={{ animationDelay: "100ms" }}>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              dragActive
                ? "border-primary bg-primary-soft"
                : "border-border bg-surface-muted hover:border-primary/50 hover:bg-primary-soft/30"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />
            <div className="pointer-events-none">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Drop files here or click to upload
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Supports: JPG, PNG, PDF (Max 10MB per file)
              </p>
              <label
                htmlFor="file-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-dark pointer-events-auto"
              >
                <Upload className="h-4 w-4" />
                Browse Files
              </label>
            </div>
          </div>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="mb-6 animate-fade-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">
                Selected Files ({files.length})
              </h3>
              <button
                onClick={() => setFiles([])}
                className="text-sm text-danger hover:text-danger-dark font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => {
                const FileIconComponent = getFileIcon(file);
                const status = uploadStatus[file.name];

                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-3 transition-all hover:border-primary/30"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                      <FileIconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
                    </div>

                    {/* Status Icons */}
                    {status === "uploading" && (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    )}
                    {status === "success" && (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    )}
                    {status === "error" && (
                      <AlertCircle className="h-5 w-5 text-danger" />
                    )}
                    {!status && (
                      <button
                        onClick={() => removeFile(index)}
                        className="text-text-muted hover:text-danger transition-colors"
                        disabled={uploading}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex gap-3 animate-fade-slide-up" style={{ animationDelay: "300ms" }}>
            <Button
              fullWidth
              onClick={handleUploadAll}
              disabled={uploading}
              icon={uploading ? Loader2 : Upload}
            >
              {uploading ? "Uploading..." : `Upload ${files.length} File${files.length > 1 ? "s" : ""}`}
            </Button>
            <Button variant="secondary" onClick={onBack} disabled={uploading}>
              Cancel
            </Button>
          </div>
        )}

        {/* Success Message */}
        {Object.values(uploadStatus).some((s) => s === "success") && (
          <div className="mt-6 rounded-xl bg-success-soft border border-success/20 p-4 flex items-start gap-3 animate-bounce-in">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-success">Upload Successful!</p>
              <p className="text-sm text-text-secondary mt-1">
                Your documents have been added to your medical timeline.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
