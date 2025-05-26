
import React, { useState, useCallback, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import DataDisplay from './components/DataDisplay';
import { extractDataFromDocument } from './services/geminiService';
import { ProcessedDocument, ExtractedData, ClientData, PropertyData, CompanyData, ClientType, CompanyType } from './types';
import { DocumentIcon, LightModeIcon, DarkModeIcon, SystemModeIcon, ExportIcon, CopyIcon, TrashIcon, LoadingSpinnerIcon, CopySuccessIcon } from './components/icons';

type Theme = 'light' | 'dark' | 'system';
const themesOrder: Theme[] = ['light', 'dark', 'system'];

// Usar os ícones atualizados
const themeIcons: Record<Theme, JSX.Element> = {
  light: <LightModeIcon className="w-5 h-5" />, // Já atualizado em icons.tsx
  dark: <DarkModeIcon className="w-5 h-5" />,   // Já atualizado em icons.tsx
  system: <SystemModeIcon className="w-5 h-5" /> // Já atualizado em icons.tsx
};
const themeLabels: Record<Theme, string> = {
  light: 'Tema Claro',
  dark: 'Tema Escuro',
  system: 'Tema do Sistema',
};

const ThemeSwitcher: React.FC<{ currentTheme: Theme; onChangeTheme: (theme: Theme) => void }> = ({ currentTheme, onChangeTheme }) => {
  const currentIndex = themesOrder.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themesOrder.length;
  const nextTheme = themesOrder[nextIndex];

  const handleThemeCycle = () => {
    onChangeTheme(nextTheme);
  };

  return (
    <button
      type="button"
      onClick={handleThemeCycle}
      className="p-2.5 rounded-[var(--md-sys-shape-corner-full)] transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-primary)] focus-visible:ring-opacity-75 bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-surface-container-highest)] shadow-sm"
      aria-label={`Mudar para ${themeLabels[nextTheme]}`}
      title={`Mudar para ${themeLabels[nextTheme]}`}
    >
      {React.cloneElement(themeIcons[currentTheme], { className: "w-6 h-6"})}
    </button>
  );
};


const App: React.FC = () => {
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); 
  const [isGlobalProcessing, setIsGlobalProcessing] = useState<boolean>(false); 
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('theme');
    return (themesOrder.includes(storedTheme as Theme) ? storedTheme : 'system') as Theme;
  });
  const [copyAllStatus, setCopyAllStatus] = useState<'idle' | 'success'>('idle');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => localStorage.getItem('geminiApiKey') || '');

  useEffect(() => {
    localStorage.setItem('geminiApiKey', geminiApiKey);
  }, [geminiApiKey]);

  useEffect(() => {
    const applyTheme = (selectedTheme: Theme) => {
      document.documentElement.setAttribute('data-theme-preference', selectedTheme);
      if (selectedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else if (selectedTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
      } else { 
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === 'system') {
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);


  useEffect(() => {
    const storedDocs = localStorage.getItem('processedDocuments');
    if (storedDocs) {
      try {
        const parsedDocs: ProcessedDocument[] = JSON.parse(storedDocs);
        const validatedDocs = parsedDocs.map(doc => ({
          ...doc,
          clientes: (doc.clientes || []).map(c => ({ ...c, id: c.id || crypto.randomUUID() })),
          imoveis: (doc.imoveis || []).map(p => ({ ...p, id: p.id || crypto.randomUUID() })),
          empresas: (doc.empresas || []).map(e => ({ ...e, id: e.id || crypto.randomUUID() })),
        }));
        setProcessedDocuments(validatedDocs);
      } catch (e) {
        console.error("Failed to parse stored documents:", e);
        localStorage.removeItem('processedDocuments');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('processedDocuments', JSON.stringify(processedDocuments));
  }, [processedDocuments]);

  const handleFileUpload = useCallback(
    async (fileName: string, fileType: string, fileContent: string) => {
      setError(null);
      if (!geminiApiKey) {
        setError("Por favor, insira sua chave de API do Gemini para processar documentos.");
        // Optionally, set isLoading to false if the operation is aborted early
        // setIsLoading(false); // Consider if this is needed based on UI feedback
        return;
      }
      try {
        const extracted: ExtractedData = await extractDataFromDocument(geminiApiKey, fileContent, fileType);
        const newDocument: ProcessedDocument = {
          id: crypto.randomUUID(),
          fileName,
          fileType,
          timestamp: new Date().toISOString(),
          clientes: extracted.clientes || [],
          imoveis: extracted.imoveis || [],
          empresas: extracted.empresas || [],
        };
        setProcessedDocuments(prevDocs => [newDocument, ...prevDocs]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Ocorreu um erro desconhecido ao processar ' + fileName);
        }
        console.error(err);
      }
    },
    [geminiApiKey] // Add geminiApiKey to dependencies
  );

  const handleDeleteDocument = useCallback((id: string) => {
    setProcessedDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
  }, []);

  // --- Client Handlers ---
  const handleUpdateClient = useCallback((docId: string, updatedClient: ClientData) => {
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, clientes: doc.clientes.map(c => (c.id === updatedClient.id ? updatedClient : c)) }
          : doc
      )
    );
  }, []);

  const handleDeleteClient = useCallback((docId: string, clientId: string) => {
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, clientes: doc.clientes.filter(c => c.id !== clientId) }
          : doc
      )
    );
  }, []);

  const handleAddClient = useCallback((docId: string) => {
    const newClient: ClientData = {
      id: crypto.randomUUID(),
      nomeCompleto: '',
      tipoCliente: ClientType.OUTRO,
    };
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, clientes: [...(doc.clientes || []), newClient] }
          : doc
      )
    );
  }, []);

  // --- Property Handlers ---
  const handleUpdateProperty = useCallback((docId: string, updatedProperty: PropertyData) => {
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, imoveis: doc.imoveis.map(p => (p.id === updatedProperty.id ? updatedProperty : p)) }
          : doc
      )
    );
  }, []);

  const handleDeleteProperty = useCallback((docId: string, propertyId: string) => {
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, imoveis: doc.imoveis.filter(p => p.id !== propertyId) }
          : doc
      )
    );
  }, []);

  const handleAddProperty = useCallback((docId: string) => {
    const newProperty: PropertyData = {
      id: crypto.randomUUID(),
      enderecoCompleto: '',
    };
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, imoveis: [...(doc.imoveis || []), newProperty] }
          : doc
      )
    );
  }, []);

  // --- Company Handlers ---
  const handleUpdateCompany = useCallback((docId: string, updatedCompany: CompanyData) => {
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, empresas: (doc.empresas || []).map(e => (e.id === updatedCompany.id ? updatedCompany : e)) }
          : doc
      )
    );
  }, []);

  const handleDeleteCompany = useCallback((docId: string, companyId: string) => {
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, empresas: (doc.empresas || []).filter(e => e.id !== companyId) }
          : doc
      )
    );
  }, []);

  const handleAddCompany = useCallback((docId: string) => {
    const newCompany: CompanyData = {
      id: crypto.randomUUID(),
      razaoSocial: '',
      tipoEmpresa: CompanyType.OUTRO,
    };
    setProcessedDocuments(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, empresas: [...(doc.empresas || []), newCompany] }
          : doc
      )
    );
  }, []);

  const formatDataForTxt = (docs: ProcessedDocument[]): string => {
    return docs.map(doc => {
      let content = `Documento: ${doc.fileName}\n`;
      content += `Tipo: ${doc.fileType}\n`;
      content += `Processado em: ${new Date(doc.timestamp).toLocaleString('pt-BR')}\n\n`;

      content += "CLIENTES (Pessoas Físicas):\n";
      content += "--------------------\n";
      if (doc.clientes && doc.clientes.length > 0) {
        doc.clientes.forEach(c => {
          content += `ID Cliente: ${c.id}\n`;
          content += `  Nome Completo: ${c.nomeCompleto || '-'}\n`;
          content += `  CPF/CNPJ: ${c.cpfCnpj || '-'}\n`;
          content += `  RG: ${c.rg || '-'}\n`;
          content += `  Endereço: ${c.endereco || '-'}\n`;
          content += `  Telefone: ${c.telefone || '-'}\n`;
          content += `  E-mail: ${c.email || '-'}\n`;
          content += `  Estado Civil: ${c.estadoCivil || '-'}\n`;
          content += `  Profissão: ${c.profissao || '-'}\n`;
          content += `  Tipo de Cliente: ${c.tipoCliente || '-'}\n`;
          content += "--------------------\n";
        });
      } else {
        content += "(Nenhum cliente encontrado/adicionado)\n--------------------\n";
      }
      
      content += "\nEMPRESAS (Pessoas Jurídicas):\n";
      content += "--------------------\n";
      if (doc.empresas && doc.empresas.length > 0) {
        doc.empresas.forEach(e => {
          content += `ID Empresa: ${e.id}\n`;
          content += `  Razão Social: ${e.razaoSocial || '-'}\n`;
          content += `  Nome Fantasia: ${e.nomeFantasia || '-'}\n`;
          content += `  CNPJ: ${e.cnpj || '-'}\n`;
          content += `  Inscrição Estadual: ${e.inscricaoEstadual || '-'}\n`;
          content += `  Inscrição Municipal: ${e.inscricaoMunicipal || '-'}\n`;
          content += `  Data de Abertura: ${e.dataAbertura || '-'}\n`;
          content += `  Endereço: ${e.enderecoCompleto || '-'}\n`;
          content += `  Telefone: ${e.telefone || '-'}\n`;
          content += `  E-mail: ${e.email || '-'}\n`;
          content += `  Ramo de Atividade: ${e.ramoAtividade || '-'}\n`;
          content += `  CNAE Principal: ${e.cnaePrincipal || '-'}\n`;
          content += `  Tipo de Empresa: ${e.tipoEmpresa || '-'}\n`;
          content += `  Capital Social: ${e.capitalSocial || '-'}\n`;
          content += `  Sócios/Admin: ${e.socios || '-'}\n`;
          content += "--------------------\n";
        });
      } else {
        content += "(Nenhuma empresa encontrada/adicionada)\n--------------------\n";
      }

      content += "\nIMÓVEIS:\n";
      content += "--------------------\n";
      if (doc.imoveis && doc.imoveis.length > 0) {
        doc.imoveis.forEach(p => {
          content += `ID Imóvel: ${p.id}\n`;
          content += `  Endereço Completo: ${p.enderecoCompleto || '-'}\n`;
          content += `  Tipo de Imóvel: ${p.tipoImovel || '-'}\n`;
          content += `  Área Total: ${p.areaTotal || '-'}\n`;
          content += `  Área Construída: ${p.areaConstruida || '-'}\n`;
          content += `  Nº Matrícula: ${p.numeroMatricula || '-'}\n`;
          content += `  IPTU: ${p.iptu || '-'}\n`;
          content += `  Valor Venda/Locação: ${p.valorVendaLocacao || '-'}\n`;
          content += `  Características: ${p.caracteristicas || '-'}\n`;
          content += "--------------------\n";
        });
      } else {
        content += "(Nenhum imóvel encontrado/adicionado)\n--------------------\n";
      }
      return content;
    }).join("\n====================================\n====================================\n\n");
  };

  const handleExportAllToTxt = () => {
    if (processedDocuments.length === 0) {
      alert("Nenhum dado para exportar.");
      return;
    }
    setIsGlobalProcessing(true);
    try {
      const txtContent = formatDataForTxt(processedDocuments);
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().slice(0,10);
      link.download = `docbiz_export_${timestamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error("Erro ao exportar para TXT:", e);
      setError("Falha ao gerar o arquivo TXT.");
    } finally {
      setIsGlobalProcessing(false);
    }
  };

  const handleCopyAllData = async () => {
    if (processedDocuments.length === 0) {
      alert("Nenhum dado para copiar.");
      return;
    }
    setIsGlobalProcessing(true);
    try {
      const jsonData = JSON.stringify(processedDocuments, null, 2);
      await navigator.clipboard.writeText(jsonData);
      setCopyAllStatus('success');
      setTimeout(() => setCopyAllStatus('idle'), 2000);
    } catch (e) {
      console.error("Erro ao copiar dados:", e);
      setError("Falha ao copiar dados para a área de transferência.");
      setCopyAllStatus('idle');
    } finally {
      setIsGlobalProcessing(false);
    }
  };

  const handleClearAllData = () => {
    if (processedDocuments.length === 0) {
      alert("Nenhum dado para limpar.");
      return;
    }
    if (window.confirm("Tem certeza que deseja apagar TODOS os dados de documentos processados? Esta ação não pode ser desfeita.")) {
      setProcessedDocuments([]);
      localStorage.removeItem('processedDocuments');
      setError(null); 
    }
  };
  
  const globalActionDisabled = isLoading || isGlobalProcessing;

  return (
    <div className="min-h-screen bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)] py-8 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-grow">
        <header className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="inline-flex items-center justify-center bg-[var(--md-sys-color-primary-container)] p-3 rounded-[var(--md-sys-shape-corner-extra-large)] shadow-md">
              <DocumentIcon className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--md-sys-color-on-primary-container)]" />
            </div>
            <ThemeSwitcher currentTheme={theme} onChangeTheme={setTheme} />
          </div>
          <div className="text-center">
             <h1 className="text-4xl sm:text-5xl font-medium text-[var(--md-sys-color-primary)] tracking-tight">
               DocBiz
            </h1>
            <p className="text-lg sm:text-xl text-[var(--md-sys-color-on-surface-variant)]">Leitor Inteligente de Documentos</p>
            <p className="mt-3 text-sm text-[var(--md-sys-color-on-surface-variant)] max-w-2xl mx-auto">
              Extraia e gerencie dados de clientes, empresas e imóveis de seus documentos com o poder da Inteligência Artificial.
            </p>
          </div>
        </header>

        <main className="flex-grow">
          {/* START: API Key Input Section */}
          <div className="mb-6 p-4 bg-[var(--md-sys-color-surface-container-low)] rounded-[var(--md-sys-shape-corner-medium)] shadow">
            <label htmlFor="apiKey" className="block text-sm font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1">
              Chave de API Gemini:
            </label>
            <input
              type="password"
              id="apiKey"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Cole sua chave de API aqui"
              className="w-full px-3 py-2 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] rounded-[var(--md-sys-shape-corner-small)] focus:ring-[var(--md-sys-color-primary)] focus:border-[var(--md-sys-color-primary)]"
            />
            {!geminiApiKey && (
              <p className="mt-1 text-xs text-[var(--md-sys-color-error)]">
                A chave de API é necessária para processar documentos.
              </p>
            )}
          </div>
          {/* END: API Key Input Section */}
          
          <FileUpload 
            onFileUpload={handleFileUpload} 
            isProcessing={isLoading || !geminiApiKey}
            setIsProcessing={setIsLoading} 
          />

          <div className="my-8 p-4 bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-large)] shadow-lg border border-[var(--md-sys-color-outline-variant)]">
            <h3 className="text-lg font-medium text-[var(--md-sys-color-on-surface-variant)] mb-4 text-center sm:text-left">Ações Globais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={handleExportAllToTxt}
                disabled={globalActionDisabled || processedDocuments.length === 0}
                className="flex items-center justify-center w-full bg-[var(--md-sys-color-secondary-container)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary-container)_90%,black)] text-[var(--md-sys-color-on-secondary-container)] font-medium py-2.5 px-4 rounded-[var(--md-sys-shape-corner-full)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-secondary)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Exportar todos os dados para um arquivo TXT"
              >
                {isGlobalProcessing && copyAllStatus === 'idle' ? <LoadingSpinnerIcon className="w-5 h-5 mr-2" /> : <ExportIcon className="w-5 h-5 mr-2" />}
                Exportar TXT
              </button>
              <button
                onClick={handleCopyAllData}
                disabled={globalActionDisabled || processedDocuments.length === 0}
                className="flex items-center justify-center w-full bg-[var(--md-sys-color-tertiary-container)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-tertiary-container)_90%,black)] text-[var(--md-sys-color-on-tertiary-container)] font-medium py-2.5 px-4 rounded-[var(--md-sys-shape-corner-full)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-tertiary)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Copiar todos os dados (JSON) para a área de transferência"
              >
                {isGlobalProcessing && copyAllStatus !== 'success' ? <LoadingSpinnerIcon className="w-5 h-5 mr-2" /> : (copyAllStatus === 'success' ? <CopySuccessIcon className="w-5 h-5 mr-2" /> : <CopyIcon className="w-5 h-5 mr-2" />)}
                {copyAllStatus === 'success' ? 'Copiado!' : 'Copiar Tudo'}
              </button>
              <button
                onClick={handleClearAllData}
                disabled={globalActionDisabled || processedDocuments.length === 0}
                className="flex items-center justify-center w-full bg-[var(--md-sys-color-error-container)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-error-container)_90%,black)] text-[var(--md-sys-color-on-error-container)] font-medium py-2.5 px-4 rounded-[var(--md-sys-shape-corner-full)] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--md-sys-color-error)] transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                title="Limpar todos os dados processados"
              >
                <TrashIcon className="w-5 h-5 mr-2" />
                Limpar Tudo
              </button>
            </div>
          </div>

          {error && (
            <div 
              className="mt-8 bg-[var(--md-sys-color-error-container)] border-l-4 border-[var(--md-sys-color-error)] text-[var(--md-sys-color-on-error-container)] p-4 rounded-[var(--md-sys-shape-corner-medium)] shadow-md" 
              role="alert"
              aria-live="assertive"
            >
              <p className="font-bold text-lg">Erro</p>
              <p>{error}</p>
              <button onClick={() => setError(null)} className="mt-2 text-sm font-medium underline">Descartar</button>
            </div>
          )}
          
          <DataDisplay 
            processedDocuments={processedDocuments} 
            onDeleteDocument={handleDeleteDocument}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onAddClient={handleAddClient}
            onUpdateProperty={handleUpdateProperty}
            onDeleteProperty={handleDeleteProperty}
            onAddProperty={handleAddProperty}
            onUpdateCompany={handleUpdateCompany}
            onDeleteCompany={handleDeleteCompany}
            onAddCompany={handleAddCompany}
            setGlobalError={setError}
          />
        </main>
      </div>

      <footer className="w-full mt-16 py-6 text-center text-sm text-[var(--md-sys-color-on-surface-variant)] border-t border-[var(--md-sys-color-outline-variant)]">
        <p>DocBiz, Leitor Inteligente de Documentos por <span className="font-semibold text-[var(--md-sys-color-tertiary)]">Imobiz</span>.</p>
        <p className="mt-1">Versão: v0.2.0 Beta</p>
      </footer>
    </div>
  );
};

export default App;