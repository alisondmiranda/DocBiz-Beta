
import React, { useState, useCallback, useRef } from 'react';
import { readFileAsDataURL, readFileAsText } from '../utils/fileReader';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../constants';
import { UploadIcon, LoadingSpinnerIcon } from './icons';
import { SupportedMimeTypes } from '../types';

interface FileUploadProps {
  onFileUpload: (fileName: string, fileType: string, fileContent: string) => Promise<void>;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing, setIsProcessing }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedMimeTypes = Object.keys(ACCEPTED_FILE_TYPES).join(',');

  const validateFile = (file: File): boolean => {
    if (!ACCEPTED_FILE_TYPES[file.type as SupportedMimeTypes]) {
      setFileError(`Tipo de arquivo não suportado: ${file.name} (${file.type}). Permitidos: ${Object.values(ACCEPTED_FILE_TYPES).map(exts => exts.join(', ')).join(', ')}`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`Arquivo ${file.name} muito grande. Máximo: ${MAX_FILE_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      let anyError = false;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (validateFile(file)) {
          newFiles.push(file);
        } else {
          anyError = true; 
          break; 
        }
      }
      if (!anyError) setFileError(null);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles].filter((f,i,self) => self.findIndex(t => t.name === f.name && t.size === f.size) === i));
    }
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-[var(--md-sys-color-primary)]', 'bg-[var(--md-sys-color-primary-container)]');
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const newFiles: File[] = [];
      let anyError = false;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (validateFile(file)) {
          newFiles.push(file);
        } else {
          anyError = true;
          break;
        }
      }
      if (!anyError) setFileError(null);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles].filter((f,i,self) => self.findIndex(t => t.name === f.name && t.size === f.size) === i));
    }
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-[var(--md-sys-color-primary)]', 'bg-[var(--md-sys-color-primary-container)]');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-[var(--md-sys-color-primary)]', 'bg-[var(--md-sys-color-primary-container)]');
  };


  const handleProcessFiles = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setFileError('Nenhum arquivo selecionado.');
      return;
    }
    setIsProcessing(true);
    setFileError(null);
    
    for (const file of selectedFiles) {
      try {
        let fileContent: string;
        if (file.type.startsWith('text/')) {
          fileContent = await readFileAsText(file);
        } else {
          fileContent = await readFileAsDataURL(file);
        }
        await onFileUpload(file.name, file.type, fileContent);
      } catch (error) {
        console.error(`Error reading or processing file ${file.name}:`, error);
        if (error instanceof Error) {
          setFileError(`Erro ao processar ${file.name}: ${error.message}`);
        } else {
          setFileError(`Erro desconhecido ao processar ${file.name}.`);
        }
      }
    }
    
    setSelectedFiles([]); 
    if(fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
    setIsProcessing(false);
  }, [selectedFiles, onFileUpload, setIsProcessing]);

  const triggerFileInput = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
  }

  return (
    <div className="bg-[var(--md-sys-color-surface)] p-6 sm:p-8 shadow-xl rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]">
      <h2 className="text-2xl font-medium text-[var(--md-sys-color-on-surface-variant)] mb-6 text-center">Upload de Documentos</h2>
      
      <div 
        className={`flex flex-col items-center justify-center w-full min-h-[14rem] border-2 border-dashed border-[var(--md-sys-color-outline)] rounded-[var(--md-sys-shape-corner-medium)] transition-colors duration-200 ease-in-out bg-[var(--md-sys-color-surface-container-low)] p-4 ${!isProcessing ? 'cursor-pointer hover:border-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-primary-container)]' : 'opacity-70'}`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Área para soltar arquivos ou clicar para selecionar"
        role="button"
        tabIndex={isProcessing ? -1 : 0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') triggerFileInput();}}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={acceptedMimeTypes}
          onChange={handleFileChange}
          disabled={isProcessing}
          multiple
          aria-hidden="true"
        />
        <UploadIcon className="w-16 h-16 text-[var(--md-sys-color-primary)] mb-3" />
        <p className="text-[var(--md-sys-color-on-surface-variant)] text-base font-medium text-center">
          {selectedFiles.length === 0 ? "Clique ou arraste os arquivos aqui" : `${selectedFiles.length} arquivo(s) selecionado(s)`}
        </p>
        <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] opacity-80 mt-1">
          Tipos suportados: JPG, PNG, PDF, DOC(X), XML, TXT, CSV
        </p>
         <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] opacity-80 mt-1">
          Tamanho máximo por arquivo: {MAX_FILE_SIZE_MB}MB
        </p>
      </div>

      {fileError && (
        <p 
          className="mt-4 text-sm text-[var(--md-sys-color-on-error-container)] bg-[var(--md-sys-color-error-container)] p-3 rounded-[var(--md-sys-shape-corner-small)]"
          role="alert"
        >
          {fileError}
        </p>
      )}
      
      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-medium text-[var(--md-sys-color-on-surface-variant)]">Arquivos Selecionados:</h3>
          <ul className="max-h-40 overflow-y-auto space-y-1 text-sm text-[var(--md-sys-color-on-surface-variant)] border border-[var(--md-sys-color-outline-variant)] rounded-[var(--md-sys-shape-corner-medium)] p-2 bg-[var(--md-sys-color-surface-container)]">
            {selectedFiles.map(file => (
              <li key={file.name + file.size} className="flex justify-between items-center p-1.5 hover:bg-[var(--md-sys-color-surface-container-high)] rounded-[var(--md-sys-shape-corner-extra-small)]">
                <span className="truncate" title={file.name}>{file.name} ({(file.size / (1024*1024)).toFixed(2)} MB)</span>
                <button 
                  onClick={() => removeFile(file.name)} 
                  className="ml-2 text-[var(--md-sys-color-error)] hover:text-[var(--md-sys-color-on-error-container)] hover:bg-[var(--md-sys-color-error-container)] p-1 rounded-[var(--md-sys-shape-corner-full)] text-xs transition-colors"
                  title="Remover arquivo"
                  disabled={isProcessing}
                  aria-label={`Remover ${file.name}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleProcessFiles}
        disabled={selectedFiles.length === 0 || isProcessing}
        className="mt-8 w-full bg-[var(--md-sys-color-primary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary)_90%,black)] text-[var(--md-sys-color-on-primary)] font-medium py-3 px-6 rounded-[var(--md-sys-shape-corner-full)] shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-opacity-50 transition-all duration-150 disabled:bg-[color-mix(in_srgb,var(--md-sys-color-on-surface)_12%,var(--md-sys-color-surface))] disabled:text-[color-mix(in_srgb,var(--md-sys-color-on-surface)_38%,var(--md-sys-color-surface))] disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center text-base"
        aria-live="polite" 
        aria-atomic="true"
      >
        {isProcessing ? (
          <>
            <LoadingSpinnerIcon className="w-5 h-5 mr-3" />
            Processando...
          </>
        ) : (
          <>
            <UploadIcon className="w-5 h-5 mr-3" />
            Processar Documento(s)
          </>
        )}
      </button>
    </div>
  );
};

export default FileUpload;