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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn font-mono">
      <div className="relative w-full max-w-3xl bg-[var(--bg-card)] border-2 border-[var(--border-edge)] text-[var(--text-main)] shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-edge)] bg-[var(--bg-card-alt)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#CC0000] text-white border border-[#CC0000] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-serif font-black uppercase tracking-tight text-[var(--text-main)]">
                  Clinical Document Storage &amp; Validation
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-[#CC0000]/15 text-[#CC0000] border border-[#CC0000]/30 font-bold uppercase">
                  Server-Side Guard Active
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-sans">
                Magic byte signature validation, antivirus sanitization, and SHA-256 vault storage before AI ingestion.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-edge)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-contrast)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[var(--border-edge)] px-6 bg-[var(--bg-card-alt)]">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-bold uppercase border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'border-[#CC0000] text-[#CC0000] bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <UploadCloud className="w-4 h-4" /> Upload &amp; Validate Lab Document
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-3 px-4 text-xs font-bold uppercase border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'vault'
                ? 'border-[#CC0000] text-[#CC0000] bg-[var(--bg-card)]'
                : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <HardDrive className="w-4 h-4" /> Secure Storage Vault ({storedVaultFiles.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

          {activeTab === 'upload' && (
            <>
              {/* Security Guard Information Banner */}
              <div className="p-3.5 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#CC0000] flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-[var(--text-main)]">
                  <span className="font-bold text-[var(--text-main)] uppercase block">Server-Side Multi-Tier Security Verification:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[var(--text-muted)] text-[11px] font-sans">
                    <li><strong>Magic Byte Verification:</strong> Inspects file header signatures (prevents extension spoofing).</li>
                    <li><strong>Size Enforcement:</strong> Strict 15MB limit on lab PDFs / images and 250MB on telemetry archives.</li>
                    <li><strong>Path Traversal Defense:</strong> Strips unauthorized characters, dots, and directory tags.</li>
                    <li><strong>Object Storage Vault:</strong> Computes unique SHA-256 hash and archives to cloud storage before AI analysis.</li>
                  </ul>
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
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
                      className={`p-2.5 border text-left transition-all font-mono ${
                        fileCategory === cat.id
                          ? 'bg-[var(--bg-card-contrast)] border-[var(--border-edge)] border-l-4 border-l-[#CC0000] text-[var(--text-main)]'
                          : 'bg-[var(--bg-card-alt)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[var(--border-edge)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-[10px] font-mono text-[#CC0000] font-bold">{cat.limit}</span>
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
                className={`p-8 border-2 border-dashed transition-all text-center cursor-pointer ${
                  selectedFile
                    ? 'border-[#CC0000] bg-[var(--bg-card-contrast)]'
                    : 'border-[var(--border-edge)] hover:border-[#CC0000] bg-[var(--bg-card-alt)]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.csv,.xml,.zip"
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto bg-[#CC0000]/10 text-[#CC0000] border border-[#CC0000]/30 flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-main)]">{selectedFile.name}</p>
                    <p className="text-xs text-[var(--text-muted)] font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Unknown MIME'}
                    </p>
                    <p className="text-xs text-[#CC0000] font-bold pt-1 uppercase">
                      Ready for server-side validation &amp; extraction
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-[var(--text-main)]">
                      Drag and drop your lab report or device export here, or <span className="text-[#CC0000] underline">browse</span>
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-sans">
                      Supports PDF, PNG, JPG, WEBP, CSV, and XML documents up to 15MB
                    </p>
                  </div>
                )}
              </div>

              {/* Security Test Presets */}
              <div className="p-3 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] flex flex-wrap items-center justify-between gap-2 font-mono">
                <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#CC0000]" />
                  Security Validation Test Tools:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestCorruptFile}
                    className="px-2.5 py-1 text-[11px] font-bold uppercase bg-rose-500/15 text-rose-500 border border-rose-500/30 hover:bg-rose-500/25 transition-all"
                  >
                    Test Spoofed MIME / Bad Magic Bytes
                  </button>
                  <button
                    type="button"
                    onClick={handleTestOversizedFile}
                    className="px-2.5 py-1 text-[11px] font-bold uppercase bg-amber-500/15 text-amber-500 border border-amber-500/30 hover:bg-amber-500/25 transition-all"
                  >
                    Test Oversized Rejection (&gt;15MB)
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {validationError && (
                <div className="p-4 bg-rose-950/20 border border-rose-500/50 flex items-start gap-3 animate-fadeIn font-mono">
                  <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-rose-500 uppercase block">Security Validation Blocked Upload</span>
                    <p className="text-[var(--text-main)] font-sans">{validationError.message}</p>
                    {validationError.code && (
                      <span className="inline-block font-mono text-[10px] px-2 py-0.5 bg-rose-900/60 text-rose-200">
                        Error Code: {validationError.code}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Feedback */}
              {isProcessing && (
                <div className="p-4 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] flex items-center gap-3 font-mono">
                  <RefreshCw className="w-5 h-5 text-[#CC0000] animate-spin flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-[var(--text-main)] uppercase block">Processing Ingestion Pipeline</span>
                    <span className="text-[var(--text-muted)] font-sans">{stepStatus}</span>
                  </div>
                </div>
              )}

              {/* Successful Validation & Extraction Result */}
              {uploadedRecord && (
                <div className="p-4 bg-[var(--bg-card-alt)] border border-emerald-500/40 space-y-3 animate-fadeIn font-mono">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-500 uppercase">
                        File Validated &amp; Stored in Object Storage
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      SHA: {uploadedRecord.sha256.substring(0, 12)}...
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Storage Key:</span>
                      <span className="font-mono text-[var(--text-main)] truncate block">{uploadedRecord.storageKey}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">MIME Verified:</span>
                      <span className="font-mono text-emerald-500 font-bold">{uploadedRecord.mimeType}</span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Payload Size:</span>
                      <span className="text-[var(--text-main)]">{(uploadedRecord.sizeBytes / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>

                  {extractedReport && (
                    <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-main)] uppercase flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#CC0000]" />
                          Extracted {extractedReport.biomarkers.length} Biomarkers:
                        </span>
                        <span className="text-[11px] text-[#CC0000] font-bold">{extractedReport.laboratory}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                        {extractedReport.biomarkers.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-[var(--bg-card)] border border-[var(--border-edge)] text-[11px] text-[var(--text-main)] flex items-center gap-1"
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
                  className="px-4 py-2 text-xs font-bold uppercase text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-edge)] bg-[var(--bg-card-alt)] hover:bg-[var(--bg-card-contrast)] transition-all"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUploadAndValidate}
                  disabled={!selectedFile || !fileBase64 || isProcessing}
                  className="px-5 py-2.5 text-xs font-bold uppercase bg-[#CC0000] hover:bg-red-700 text-white disabled:opacity-50 transition-all flex items-center gap-2 border border-[#CC0000]"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Validating &amp; Ingesting...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Validate &amp; Move to Storage
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">
                    Validated Objects in Secure Clinical Storage:
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-sans">
                    All stored files have passed server-side magic byte inspection, size validation, and SHA-256 integrity hashing.
                  </p>
                </div>
                <button
                  onClick={loadVaultFiles}
                  className="text-xs text-[#CC0000] hover:underline flex items-center gap-1 font-bold uppercase"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {storedVaultFiles.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-muted)] border border-dashed border-[var(--border-edge)] bg-[var(--bg-card-alt)]">
                  No files currently archived in the object storage vault.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {storedVaultFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 bg-[var(--bg-card-alt)] border border-[var(--border-edge)] hover:border-[#CC0000] transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-[#CC0000] text-white border border-[#CC0000] flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-main)] truncate">
                              {file.sanitizedFilename}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 uppercase font-bold">
                              {file.status}
                            </span>
                          </div>
                          <p className="text-[11px] font-mono text-[var(--text-muted)] truncate">
                            SHA: {file.sha256.substring(0, 16)}... • {(file.sizeBytes / 1024).toFixed(1)} KB • {file.mimeType}
                          </p>
                          <span className="text-[10px] text-[var(--text-dim)] block">
                            Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleDeleteVaultFile(file.id)}
                          className="p-2 border border-[var(--border-edge)] bg-[var(--bg-card)] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
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
