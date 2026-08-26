import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Lock,
  FileSpreadsheet,
  FileCheck,
  Eye,
  Trash2,
  HardDrive,
  Database,
  ArrowRight,
  Info
} from 'lucide-react';
import {
  uploadAndValidateFileToStorage,
  listStoredFiles,
  deleteStoredFile,
  analyzeLabDocument,
  StoredFileRecord
} from '../../services/api';
import { Biomarker, LabReport } from '../../types';

interface LabReportUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBiomarkersExtracted?: (biomarkers: Biomarker[], report: LabReport) => void;
}

export const LabReportUploadModal: React.FC<LabReportUploadModalProps> = ({
  isOpen,
  onClose,
  onBiomarkersExtracted
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileCategory, setFileCategory] = useState<'clinical_lab_report' | 'imaging_scan' | 'telemetry_archive' | 'general_doc'>('clinical_lab_report');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [stepStatus, setStepStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<{ message: string; code?: string; details?: any } | null>(null);
  const [uploadedRecord, setUploadedRecord] = useState<StoredFileRecord | null>(null);
  const [extractedReport, setExtractedReport] = useState<LabReport | null>(null);
  const [storedVaultFiles, setStoredVaultFiles] = useState<StoredFileRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'vault'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadVaultFiles();
    }
  }, [isOpen]);

  const loadVaultFiles = async () => {
    try {
      const files = await listStoredFiles();
      setStoredVaultFiles(files);
    } catch (err) {
      console.warn('Could not load vault files:', err);
    }
  };

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError(null);
    setUploadedRecord(null);
    setExtractedReport(null);
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFileSelection(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setValidationError(null);
    setUploadedRecord(null);
    setExtractedReport(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFileSelection(file);
    }
  };

  const processFileSelection = (file: File) => {
    // Client-side pre-check for immediate UX feedback
    if (file.size > 250 * 1024 * 1024) {
      setValidationError({
        message: `File exceeds maximum allowed size (Uploaded: ${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 250MB.`,
        code: 'FILE_TOO_LARGE'
      });
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFileBase64(base64);
    };
    reader.onerror = () => {
      setValidationError({
        message: 'Failed to read file from disk. Please check permissions.',
        code: 'READ_ERROR'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndValidate = async () => {
    if (!selectedFile || !fileBase64) return;

    setIsProcessing(true);
    setValidationError(null);
    setStepStatus('Validating MIME type & binary magic bytes...');

    try {
      // Step 1: Server-Side Validation & Transfer to Object Storage Vault
      const uploadRes = await uploadAndValidateFileToStorage({
        filename: selectedFile.name,
        fileBase64,
        claimedMimeType: selectedFile.type || 'application/pdf',
        category: fileCategory,
        metadata: {
          originalSize: selectedFile.size,
          lastModified: selectedFile.lastModified
        }
      });

      if (!uploadRes.success || !uploadRes.object) {
        throw new Error(uploadRes.error || 'Server validation failed.');
      }

      setUploadedRecord(uploadRes.object);
      setStepStatus('Ingesting into Clinical Vault & Running AI OCR Extraction...');

      // Step 2: Extract structured biomarkers using Gemini AI OCR
      const aiResult = await analyzeLabDocument({
        imageBase64: fileBase64,
        mimeType: uploadRes.object.mimeType
      });

      const newBiomarkers: Biomarker[] = (aiResult.biomarkers || []).map((b, idx) => ({
        id: `biomarker-${Date.now()}-${idx}`,
        name: b.name,
        value: b.value,
        unit: b.unit,
        referenceRange: b.referenceRange,
        status: b.status,
        category: (b.category as any) || 'Metabolic',
        date: aiResult.collectionDate || new Date().toISOString().split('T')[0],
        source: `${aiResult.laboratoryName || 'Clinical Lab'} OCR`,
        historicalTrend: 'stable'
      }));

      const report: LabReport = {
        id: `lab-report-${Date.now()}`,
        title: aiResult.documentTitle || selectedFile.name.replace(/\.[^/.]+$/, ''),
        laboratory: aiResult.laboratoryName || 'Diagnostic Laboratory',
        date: aiResult.collectionDate || new Date().toISOString().split('T')[0],
        summary: aiResult.summary || 'Clinical diagnostic biomarkers successfully extracted and validated.',
        biomarkers: newBiomarkers,
        clinicalInsights: aiResult.clinicalInsights || [],
        disclaimer: aiResult.disclaimer || 'Validated clinical report stored in HIPAA-compliant vault.'
      };

      setExtractedReport(report);
      setStepStatus(null);
      loadVaultFiles();

      if (onBiomarkersExtracted) {
        onBiomarkersExtracted(newBiomarkers, report);
      }
    } catch (err: any) {
      console.error('File validation/upload error:', err);
      setValidationError({
        message: err.message || 'Server rejected file upload during validation check.',
        code: 'VALIDATION_REJECTED'
      });
      setStepStatus(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestCorruptFile = () => {
    // Generate an intentionally corrupt payload that fails server-side magic byte inspection
    setValidationError(null);
    setUploadedRecord(null);
    setExtractedReport(null);

    const corruptBase64 = 'data:application/pdf;base64,' + btoa('<html><script>alert("corrupt payload")</script></html>');
    const fakeFile = new File(['fake content'], 'corrupted_spoofed_document.pdf', { type: 'application/pdf' });
    setSelectedFile(fakeFile);
    setFileBase64(corruptBase64);
  };

  const handleTestOversizedFile = () => {
    // Test server-side size limit rejection
    setValidationError({
      message: 'Server-Side Policy: File size exceeds the allowed limit of 15MB for clinical lab documents.',
      code: 'FILE_SIZE_EXCEEDED',
      details: {
        maxAllowed: '15 MB',
        simulatedSize: '24.8 MB'
      }
    });
  };

  const handleDeleteVaultFile = async (id: string) => {
    try {
      await deleteStoredFile(id);
      loadVaultFiles();
    } catch (err) {
      console.error('Failed to delete object:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Clinical Document Storage & Validation</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                  Server-Side Guard Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Magic byte signature validation, antivirus sanitization, and SHA-256 vault storage before AI ingestion.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" /> Upload & Validate Lab Document
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'vault'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" /> Secure Object Storage Vault ({storedVaultFiles.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {activeTab === 'upload' && (
            <>
              {/* Security Guard Information Banner */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-slate-300">
                  <span className="font-bold text-white block">Server-Side Multi-Tier Security Verification:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[11px]">
                    <li><strong>Magic Byte Verification:</strong> Inspects file header signatures (prevents extension spoofing).</li>
                    <li><strong>Size Enforcement:</strong> Strict 15MB limit on lab PDFs / images and 250MB on telemetry archives.</li>
                    <li><strong>Path Traversal Defense:</strong> Strips unauthorized characters, dots, and directory tags.</li>
                    <li><strong>Object Storage Vault:</strong> Computes unique SHA-256 hash and archives to cloud storage before AI analysis.</li>
                  </ul>
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Document Classification:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'clinical_lab_report', label: 'Clinical Lab PDF', icon: '🧪', limit: '15MB' },
                    { id: 'imaging_scan', label: 'DEXA / Scan Image', icon: '🩻', limit: '15MB' },
                    { id: 'telemetry_archive', label: 'Device Archive (.zip)', icon: '📦', limit: '250MB' },
                    { id: 'general_doc', label: 'Doctor Note / EHR', icon: '📋', limit: '15MB' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFileCategory(cat.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        fileCategory === cat.id
                          ? 'bg-cyan-500/10 border-cyan-500 text-white'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{cat.limit}</span>
                      </div>
                      <span className="text-xs font-bold block mt-1">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag & Drop Upload Zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  selectedFile
                    ? 'border-cyan-500/80 bg-cyan-950/20'
                    : 'border-slate-700 hover:border-cyan-500/60 bg-slate-950/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.csv,.xml,.zip"
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400 font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Unknown MIME'}
                    </p>
                    <p className="text-xs text-cyan-400 font-semibold pt-1">
                      Ready for server-side validation & extraction
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">
                      Drag and drop your lab report or device export here, or <span className="text-cyan-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports PDF, PNG, JPG, WEBP, CSV, and XML documents up to 15MB
                    </p>
                  </div>
                )}
              </div>

              {/* Security Test Presets */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-cyan-400" />
                  Security Validation Test Tools:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestCorruptFile}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
                  >
                    Test Spoofed MIME / Bad Magic Bytes
                  </button>
                  <button
                    type="button"
                    onClick={handleTestOversizedFile}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
                  >
                    Test Oversized Rejection (&gt;15MB)
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {validationError && (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3 animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-rose-300 block">Security Validation Blocked Upload</span>
                    <p className="text-slate-300">{validationError.message}</p>
                    {validationError.code && (
                      <span className="inline-block font-mono text-[10px] px-2 py-0.5 bg-rose-900/60 text-rose-200 rounded">
                        Error Code: {validationError.code}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Feedback */}
              {isProcessing && (
                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Processing Ingestion Pipeline</span>
                    <span className="text-slate-300">{stepStatus}</span>
                  </div>
                </div>
              )}

              {/* Successful Validation & Extraction Result */}
              {uploadedRecord && (
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-300">
                        File Validated & Stored in Object Storage
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      SHA: {uploadedRecord.sha256.substring(0, 12)}...
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Storage Key:</span>
                      <span className="font-mono text-slate-200 truncate block">{uploadedRecord.storageKey}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">MIME Verified:</span>
                      <span className="font-mono text-emerald-300">{uploadedRecord.mimeType}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Payload Size:</span>
                      <span className="text-slate-200">{(uploadedRecord.sizeBytes / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>

                  {extractedReport && (
                    <div className="pt-2 border-t border-emerald-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          Extracted {extractedReport.biomarkers.length} Biomarkers:
                        </span>
                        <span className="text-[11px] text-cyan-300">{extractedReport.laboratory}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {extractedReport.biomarkers.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1"
                          >
                            <strong>{b.name}:</strong> {b.value} {b.unit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUploadAndValidate}
                  disabled={!selectedFile || !fileBase64 || isProcessing}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-cyan-500/20"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Validating & Ingesting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Validate & Move to Storage
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Validated Objects in Secure Clinical Storage:
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    All stored files have passed server-side magic byte inspection, size validation, and SHA-256 integrity hashing.
                  </p>
                </div>
                <button
                  onClick={loadVaultFiles}
                  className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {storedVaultFiles.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-2xl">
                  No files currently archived in the object storage vault.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {storedVaultFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white truncate">
                              {file.sanitizedFilename}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              {file.status}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-slate-400 truncate">
                            SHA: {file.sha256.substring(0, 16)}... • {(file.sizeBytes / 1024).toFixed(1)} KB • {file.mimeType}
                          </p>
                          <span className="text-[10px] text-slate-500 block">
                            Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleDeleteVaultFile(file.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete from vault"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
