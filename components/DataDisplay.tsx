
import React, { useState, useMemo, useCallback } from 'react';
import { ProcessedDocument, ClientData, PropertyData, CompanyData, ClientType, CompanyType } from '../types';
import { CLIENT_TYPES, COMPANY_TYPES } from '../constants';
import { SearchIcon, DocumentIcon, UserCircleIcon, BuildingIcon, CompanyIcon, TrashIcon, EditIcon, SaveIcon, CancelIcon, AddIcon, CopyIcon, CopySuccessIcon, LetterCaseUppercaseIcon, LetterCaseLowercaseIcon, LetterCaseTitleIcon } from './icons';

// Helper for Title Case
const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
};

interface CaseTransformButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}
const CaseTransformButton: React.FC<CaseTransformButtonProps> = ({ onClick, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="p-1.5 text-[var(--md-sys-color-secondary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary)_10%,transparent)] rounded-[var(--md-sys-shape-corner-full)]"
  >
    {children}
  </button>
);


interface EditableFieldProps {
  value: string | number | undefined | null;
  onChange: (newValue: string) => void;
  label: string;
  isEditing: boolean;
  type?: 'text' | 'textarea' | 'select';
  options?: string[];
  placeholder?: string;
  fieldKey: string; 
  onCopyError: (message: string) => void;
  isNameField?: boolean; // To show case transform buttons
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onChange, label, isEditing, type = 'text', options, placeholder, fieldKey, onCopyError, isNameField }) => {
  const displayValue = (value === null || value === undefined || String(value).trim() === "") ? "-" : String(value);
  const uniqueId = `${fieldKey}-${label.replace(/\s+/g, '-')}`;
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success'>('idle');

  const handleCopyField = async () => {
    if (displayValue === "-") return;
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 1500);
    } catch (err) {
      console.error('Failed to copy field value: ', err);
      onCopyError(`Falha ao copiar "${label}".`);
      setCopyStatus('idle');
    }
  };

  const handleCaseTransform = (transformType: 'upper' | 'lower' | 'title') => {
    const currentValue = String(value || '');
    if (transformType === 'upper') onChange(currentValue.toUpperCase());
    else if (transformType === 'lower') onChange(currentValue.toLowerCase());
    else if (transformType === 'title') onChange(toTitleCase(currentValue));
  };

  if (isEditing) {
    const commonInputClass = "w-full p-2.5 border border-[var(--md-sys-color-outline)] rounded-[var(--md-sys-shape-corner-extra-small)] bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface)] focus:border-[var(--md-sys-color-primary)] focus:ring-1 focus:ring-[var(--md-sys-color-primary)] shadow-sm transition-colors";
    return (
      <div className="grid grid-cols-3 gap-x-3 gap-y-1 py-1.5 items-start"> {/* Changed to items-start for textarea */}
        <label htmlFor={uniqueId} className="text-[var(--md-sys-color-on-surface-variant)] capitalize col-span-1 font-medium text-sm pt-2.5">{label.replace(/([A-Z])/g, ' $1').trim()}:</label>
        <div className="col-span-2">
          {type === 'select' && options ? (
            <select
              id={uniqueId}
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              className={commonInputClass + " appearance-none bg-no-repeat bg-right pr-8"}
              style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23${'var(--md-sys-color-on-surface-variant)'.substring(24,30)}'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`, backgroundSize: '1.5em', backgroundPosition: 'right 0.5rem center' }}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              id={uniqueId}
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              rows={3}
              className={commonInputClass}
              placeholder={placeholder || label}
            />
          ) : (
            <input
              id={uniqueId}
              type="text"
              value={String(value || '')}
              onChange={(e) => onChange(e.target.value)}
              className={commonInputClass}
              placeholder={placeholder || label}
            />
          )}
          {isNameField && (
            <div className="flex space-x-1 mt-1.5">
              <CaseTransformButton onClick={() => handleCaseTransform('title')} title="Primeiras Maiúsculas">
                <LetterCaseTitleIcon className="w-4 h-4" />
              </CaseTransformButton>
              <CaseTransformButton onClick={() => handleCaseTransform('upper')} title="Tudo Maiúsculo">
                <LetterCaseUppercaseIcon className="w-4 h-4" />
              </CaseTransformButton>
              <CaseTransformButton onClick={() => handleCaseTransform('lower')} title="Tudo Minúsculo">
                <LetterCaseLowercaseIcon className="w-4 h-4" />
              </CaseTransformButton>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="text-sm grid grid-cols-3 gap-x-3 gap-y-1 py-1.5 border-b border-[var(--md-sys-color-surface-container-high)] last:border-b-0 group/field">
      <strong className="text-[var(--md-sys-color-on-surface-variant)] capitalize col-span-1 font-medium">{label.replace(/([A-Z])/g, ' $1').trim()}:</strong>
      <div className="col-span-2 flex justify-between items-center">
        <span className="text-[var(--md-sys-color-on-surface)] break-words flex-grow">{displayValue}</span>
        {displayValue !== "-" && (
          <button 
            onClick={handleCopyField}
            className="ml-2 p-1 rounded-[var(--md-sys-shape-corner-full)] text-[var(--md-sys-color-secondary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary)_10%,transparent)] opacity-0 group-hover/field:opacity-100 focus:opacity-100 transition-opacity"
            title={copyStatus === 'success' ? 'Copiado!' : `Copiar ${label.replace(/([A-Z])/g, ' $1').trim()}`}
            aria-label={`Copiar ${label.replace(/([A-Z])/g, ' $1').trim()}`}
          >
            {copyStatus === 'success' ? <CopySuccessIcon className="w-4 h-4 text-[var(--md-sys-color-tertiary)]" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};


interface DataItemCardProps<T extends ClientData | PropertyData | CompanyData> {
  itemData: T;
  itemType: 'client' | 'property' | 'company';
  onUpdate: (updatedData: T) => void;
  onDelete: () => void;
  onCopyError: (message: string) => void;
}

const DataItemCard = <T extends ClientData | PropertyData | CompanyData>({ itemData, itemType, onUpdate, onDelete, onCopyError }: DataItemCardProps<T>) => {
  const [isEditing, setIsEditing] = useState(!Object.values(itemData).some(v => v && String(v).trim() !== '' && v !== (itemData as any).id));
  const [editData, setEditData] = useState<T>(itemData);
  const [copyItemStatus, setCopyItemStatus] = useState<'idle' | 'success'>('idle');

  const handleFieldChange = (key: keyof T, value: string) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(itemData); 
    setIsEditing(false);
    if (!Object.values(itemData).some(v => v && String(v).trim() !== '' && v !== (itemData as any).id)) {
        onDelete();
    }
  };
  
  const clientFieldLabels: Record<keyof ClientData, string> = {
      id: 'ID', nomeCompleto: 'Nome Completo', cpfCnpj: 'CPF/CNPJ', rg: 'RG', endereco: 'Endereço',
      telefone: 'Telefone', email: 'E-mail', estadoCivil: 'Estado Civil', profissao: 'Profissão', tipoCliente: 'Tipo de Cliente'
  };

  const propertyFieldLabels: Record<keyof PropertyData, string> = {
      id: 'ID', enderecoCompleto: 'Endereço Completo', tipoImovel: 'Tipo de Imóvel', areaTotal: 'Área Total', areaConstruida: 'Área Construída',
      numeroMatricula: 'Nº Matrícula', iptu: 'IPTU', valorVendaLocacao: 'Valor Venda/Locação', caracteristicas: 'Características'
  };
  
  const companyFieldLabels: Record<keyof CompanyData, string> = {
      id: 'ID', razaoSocial: 'Razão Social', nomeFantasia: 'Nome Fantasia', cnpj: 'CNPJ', inscricaoEstadual: 'Inscrição Estadual',
      inscricaoMunicipal: 'Inscrição Municipal', dataAbertura: 'Data de Abertura', enderecoCompleto: 'Endereço Completo',
      telefone: 'Telefone', email: 'E-mail', ramoAtividade: 'Ramo de Atividade', cnaePrincipal: 'CNAE Principal',
      tipoEmpresa: 'Tipo de Empresa', capitalSocial: 'Capital Social', socios: 'Sócios/Administradores'
  };
  
  const fieldLabels = itemType === 'client' ? clientFieldLabels as Record<keyof T, string> 
                     : itemType === 'property' ? propertyFieldLabels as Record<keyof T, string>
                     : companyFieldLabels as Record<keyof T, string>;
  
  const fieldOrder = itemType === 'client' ? 
    ['nomeCompleto', 'tipoCliente', 'cpfCnpj', 'rg', 'email', 'telefone', 'endereco', 'estadoCivil', 'profissao'] :
    itemType === 'property' ?
    ['enderecoCompleto', 'tipoImovel', 'areaTotal', 'areaConstruida', 'numeroMatricula', 'iptu', 'valorVendaLocacao', 'caracteristicas'] :
    ['razaoSocial', 'nomeFantasia', 'tipoEmpresa', 'cnpj', 'inscricaoEstadual', 'inscricaoMunicipal', 'dataAbertura', 'email', 'telefone', 'enderecoCompleto', 'ramoAtividade', 'cnaePrincipal', 'capitalSocial', 'socios'];

  const formatItemDataAsText = (data: T, labels: Record<keyof T, string>, order: (keyof T)[]): string => {
    let text = '';
    for (const key of order) {
      if (key === 'id') continue;
      const value = data[key];
      if (value !== null && value !== undefined && String(value).trim() !== '') {
        text += `${labels[key] || String(key).replace(/([A-Z])/g, ' $1').trim()}: ${value}\n`;
      }
    }
    return text.trim();
  };

  const handleCopyItemData = async () => {
    try {
      const textToCopy = formatItemDataAsText(itemData, fieldLabels, fieldOrder as (keyof T)[]);
      if (!textToCopy) {
        onCopyError(`Nenhum dado para copiar de ${itemType}.`);
        return;
      }
      await navigator.clipboard.writeText(textToCopy);
      setCopyItemStatus('success');
      setTimeout(() => setCopyItemStatus('idle'), 1500);
    } catch (err) {
      console.error('Failed to copy item data: ', err);
      onCopyError(`Falha ao copiar dados de ${itemType}.`);
      setCopyItemStatus('idle');
    }
  };

  const itemTypeName = itemType === 'client' ? 'cliente' : itemType === 'property' ? 'imóvel' : 'empresa';

  return (
    <div className="p-4 bg-[var(--md-sys-color-surface-container)] rounded-[var(--md-sys-shape-corner-medium)] shadow-sm border border-[var(--md-sys-color-outline-variant)] relative group/card">
       <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover/card:opacity-100 focus-within:opacity-100 transition-opacity z-10">
        <button
            onClick={handleCopyItemData}
            className="p-2 text-[var(--md-sys-color-secondary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-secondary)_10%,transparent)] rounded-[var(--md-sys-shape-corner-full)]"
            title={copyItemStatus === 'success' ? `Dados do ${itemTypeName} copiados!` : `Copiar dados do ${itemTypeName}`}
            aria-label={`Copiar dados do ${itemTypeName}`}
          >
            {copyItemStatus === 'success' ? <CopySuccessIcon className="w-5 h-5 text-[var(--md-sys-color-tertiary)]" /> : <CopyIcon className="w-5 h-5" />}
          </button>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="p-2 text-[var(--md-sys-color-primary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary)_10%,transparent)] rounded-[var(--md-sys-shape-corner-full)]" 
            title={`Editar ${itemTypeName}`}
            aria-label={`Editar ${itemTypeName}`}
            >
            <EditIcon className="w-5 h-5" />
          </button>
        )}
        <button 
            onClick={onDelete} 
            className="p-2 text-[var(--md-sys-color-error)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-error)_10%,transparent)] rounded-[var(--md-sys-shape-corner-full)]" 
            title={`Excluir ${itemTypeName.charAt(0).toUpperCase() + itemTypeName.slice(1)}`}
            aria-label={`Excluir ${itemTypeName}`}
            >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="pt-10"> {/* Added padding-top to prevent content overlap with action buttons */}
        {fieldOrder.map(key => {
          const fieldKey = key as keyof T;
          if (fieldKey === 'id') return null;

          let fieldType: 'text' | 'textarea' | 'select' = 'text';
          let options: string[] | undefined;
          let placeholder = fieldLabels[fieldKey];
          let isNameField = false;

          if (itemType === 'client') {
              if (fieldKey === 'tipoCliente') { fieldType = 'select'; options = CLIENT_TYPES; placeholder = "Selecione o tipo"; }
              if (fieldKey === 'nomeCompleto') isNameField = true;
              if (fieldKey === 'endereco') fieldType = 'textarea';
          } else if (itemType === 'property') {
              if (fieldKey === 'caracteristicas' || fieldKey === 'enderecoCompleto') fieldType = 'textarea';
          } else if (itemType === 'company') {
              if (fieldKey === 'tipoEmpresa') { fieldType = 'select'; options = COMPANY_TYPES; placeholder = "Selecione o tipo"; }
              if (fieldKey === 'razaoSocial' || fieldKey === 'nomeFantasia') isNameField = true;
              if (fieldKey === 'enderecoCompleto' || fieldKey === 'ramoAtividade' || fieldKey === 'socios') fieldType = 'textarea';
          }
          
          return (
            <EditableField
              key={String(fieldKey)}
              fieldKey={String(fieldKey)}
              label={fieldLabels[fieldKey] || String(fieldKey)}
              value={editData[fieldKey] as string | undefined}
              onChange={(val) => handleFieldChange(fieldKey, val)}
              isEditing={isEditing}
              type={fieldType}
              options={options}
              placeholder={placeholder}
              onCopyError={onCopyError}
              isNameField={isNameField}
            />
          );
        })}
        {isEditing && (
          <div className="mt-4 flex justify-end space-x-3">
            <button 
              onClick={handleCancel} 
              className="px-5 py-2 text-sm text-[var(--md-sys-color-primary)] border border-[var(--md-sys-color-outline)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary)_8%,transparent)] rounded-[var(--md-sys-shape-corner-full)] font-medium flex items-center transition-colors"
              aria-label="Cancelar edição"
              >
              <CancelIcon className="w-4 h-4 mr-2" /> Cancelar
            </button>
            <button 
              onClick={handleSave} 
              className="px-5 py-2 text-sm text-[var(--md-sys-color-on-primary)] bg-[var(--md-sys-color-primary)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-primary)_90%,black)] rounded-[var(--md-sys-shape-corner-full)] font-medium flex items-center shadow-sm hover:shadow-md transition-all"
              aria-label="Salvar alterações"
              >
              <SaveIcon className="w-4 h-4 mr-2" /> Salvar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


interface DataDisplayProps {
  processedDocuments: ProcessedDocument[];
  onDeleteDocument: (id: string) => void;
  onUpdateClient: (docId: string, client: ClientData) => void;
  onDeleteClient: (docId: string, clientId: string) => void;
  onAddClient: (docId: string) => void;
  onUpdateProperty: (docId: string, property: PropertyData) => void;
  onDeleteProperty: (docId: string, propertyId: string) => void;
  onAddProperty: (docId: string) => void;
  onUpdateCompany: (docId: string, company: CompanyData) => void;
  onDeleteCompany: (docId: string, companyId: string) => void;
  onAddCompany: (docId: string) => void;
  setGlobalError: (message: string | null) => void;
}

const DataCard: React.FC<{ 
    item: ProcessedDocument; 
    onDelete: (id: string) => void;
    onUpdateClient: (docId: string, client: ClientData) => void;
    onDeleteClient: (docId: string, clientId: string) => void;
    onAddClient: (docId: string) => void;
    onUpdateProperty: (docId: string, property: PropertyData) => void;
    onDeleteProperty: (docId: string, propertyId: string) => void;
    onAddProperty: (docId: string) => void;
    onUpdateCompany: (docId: string, company: CompanyData) => void;
    onDeleteCompany: (docId: string, companyId: string) => void;
    onAddCompany: (docId: string) => void;
    setGlobalError: (message: string | null) => void;
}> = ({ 
  item, 
  onDelete, 
  onUpdateClient, onDeleteClient, onAddClient,
  onUpdateProperty, onDeleteProperty, onAddProperty,
  onUpdateCompany, onDeleteCompany, onAddCompany,
  setGlobalError 
}) => {
  const [isClientOpen, setIsClientOpen] = useState(item.clientes && item.clientes.length > 0);
  const [isPropertyOpen, setIsPropertyOpen] = useState(item.imoveis && item.imoveis.length > 0);
  const [isCompanyOpen, setIsCompanyOpen] = useState(item.empresas && item.empresas.length > 0);

  const renderDataSection = <DataT extends ClientData | PropertyData | CompanyData>(
    title: string, 
    dataArray: DataT[] | undefined, 
    icon: React.ReactNode, 
    isOpen: boolean, 
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    itemType: 'client' | 'property' | 'company',
    onUpdateItem: (updatedItem: DataT) => void,
    onDeleteItem: (itemId: string) => void,
    onAddItem: () => void
  ) => {
    const sectionId = `section-${item.id}-${itemType}`;
    const headerId = `header-${item.id}-${itemType}`;
    return (
      <div className="mt-4">
        <div 
            id={headerId}
            className="flex items-center justify-between w-full text-left text-[var(--md-sys-color-on-surface-variant)] font-medium p-3 bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-surface-container-highest)] rounded-t-[var(--md-sys-shape-corner-medium)] transition-colors"
        >
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center grow py-1"
                aria-expanded={isOpen}
                aria-controls={sectionId}
            >
                {icon}
                <span className="ml-2 text-lg">{title} ({dataArray?.length || 0})</span>
                <span className={`ml-auto mr-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <button 
                onClick={onAddItem} 
                className="text-sm bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-tertiary-container)_90%,black)] font-medium py-1.5 px-3 rounded-[var(--md-sys-shape-corner-full)] flex items-center transition-colors"
                title={`Adicionar ${itemType === 'client' ? "Cliente" : itemType === 'property' ? "Imóvel" : "Empresa"}`}
                aria-label={`Adicionar novo ${itemType === 'client' ? 'cliente' : itemType === 'property' ? 'imóvel' : 'empresa'}`}
            >
                <AddIcon className="w-4 h-4 mr-1.5" /> Adicionar
            </button>
        </div>
        {isOpen && (
          <div 
            id={sectionId}
            role="region"
            aria-labelledby={headerId}
            className={`space-y-4 p-4 bg-[var(--md-sys-color-surface-container-low)] rounded-b-[var(--md-sys-shape-corner-medium)] ${ (dataArray && dataArray.length > 0) ? 'border-x border-b border-[var(--md-sys-color-outline-variant)]' : ''}`}
          >
            {(!dataArray || dataArray.length === 0) && (
                 <p className="text-sm text-[var(--md-sys-color-on-surface-variant)] py-4 text-center">Nenhuma informação encontrada ou adicionada para {title.toLowerCase()}.</p>
            )}
            {dataArray && dataArray.map((dataItem) => (
              <DataItemCard
                key={(dataItem as any).id}
                itemData={dataItem}
                itemType={itemType}
                onUpdate={onUpdateItem}
                onDelete={() => onDeleteItem((dataItem as any).id)}
                onCopyError={setGlobalError}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[var(--md-sys-color-surface)] shadow-xl rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)] p-5 sm:p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-start mb-5">
        <div>
          <div className="flex items-center text-[var(--md-sys-color-primary)]">
            <DocumentIcon className="w-7 h-7 mr-2.5 flex-shrink-0" />
            <h3 className="text-2xl font-medium text-[var(--md-sys-color-on-surface)] break-all" title={item.fileName}>{item.fileName}</h3>
          </div>
          <p className="text-xs text-[var(--md-sys-color-on-surface-variant)] mt-1.5 ml-1">
            Tipo: {item.fileType} | Processado em: {new Date(item.timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button 
          onClick={() => onDelete(item.id)}
          className="ml-2 text-[var(--md-sys-color-error)] hover:bg-[color-mix(in_srgb,var(--md-sys-color-error)_10%,transparent)] p-2 rounded-[var(--md-sys-shape-corner-full)] transition-colors flex-shrink-0"
          title="Excluir este documento e todos os seus dados"
          aria-label={`Excluir documento ${item.fileName}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {renderDataSection<ClientData>("Clientes", item.clientes, <UserCircleIcon className="w-6 h-6 text-[var(--md-sys-color-secondary)]" />, isClientOpen, setIsClientOpen, 'client', 
        (client) => onUpdateClient(item.id, client), 
        (clientId) => onDeleteClient(item.id, clientId),
        () => onAddClient(item.id)
      )}
      {renderDataSection<CompanyData>("Empresas", item.empresas, <CompanyIcon className="w-6 h-6 text-[var(--md-sys-color-primary)]" />, isCompanyOpen, setIsCompanyOpen, 'company',
        (company) => onUpdateCompany(item.id, company),
        (companyId) => onDeleteCompany(item.id, companyId),
        () => onAddCompany(item.id)
      )}
      {renderDataSection<PropertyData>("Imóveis", item.imoveis, <BuildingIcon className="w-6 h-6 text-[var(--md-sys-color-tertiary)]" />, isPropertyOpen, setIsPropertyOpen, 'property',
        (property) => onUpdateProperty(item.id, property),
        (propertyId) => onDeleteProperty(item.id, propertyId),
        () => onAddProperty(item.id)
      )}
    </div>
  );
};


const DataDisplay: React.FC<DataDisplayProps> = ({ 
  processedDocuments, 
  onDeleteDocument,
  onUpdateClient,
  onDeleteClient,
  onAddClient,
  onUpdateProperty,
  onDeleteProperty,
  onAddProperty,
  onUpdateCompany,
  onDeleteCompany,
  onAddCompany,
  setGlobalError
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) {
      return processedDocuments;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return processedDocuments.filter(doc => {
      if (doc.fileName.toLowerCase().includes(lowerSearchTerm)) return true;
      if (doc.fileType.toLowerCase().includes(lowerSearchTerm)) return true;

      const checkData = (dataArray: any[] | undefined): boolean => {
        if (!dataArray) return false;
        return dataArray.some(item => 
          Object.values(item).some(val => 
            String(val).toLowerCase().includes(lowerSearchTerm)
          )
        );
      };

      if (checkData(doc.clientes)) return true;
      if (checkData(doc.imoveis)) return true;
      if (checkData(doc.empresas)) return true;
      
      return false;
    });
  }, [processedDocuments, searchTerm]);
  
  const sortedDocuments = useMemo(() => {
    return [...filteredDocuments].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [filteredDocuments]);


  if (processedDocuments.length === 0 && !searchTerm) { 
    return (
      <div className="mt-12 text-center text-[var(--md-sys-color-on-surface-variant)] py-12 bg-[var(--md-sys-color-surface-container-low)] shadow-lg rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]">
        <DocumentIcon className="w-20 h-20 mx-auto mb-6 text-[var(--md-sys-color-secondary)] opacity-70" />
        <p className="text-2xl font-medium mb-2">Nenhum documento processado.</p>
        <p className="text-base">Faça o upload de um documento para extrair e gerenciar os dados.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-[var(--md-sys-color-on-surface-variant)]" />
        </div>
        <input
          type="search"
          placeholder="Buscar em documentos (nome, tipo, dados de clientes, empresas, imóveis...)"
          className="w-full p-3.5 pl-12 pr-4 border border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-[var(--md-sys-shape-corner-full)] shadow-sm focus:ring-2 focus:ring-[var(--md-sys-color-primary)] focus:border-[var(--md-sys-color-primary)] transition-colors placeholder:text-[var(--md-sys-color-on-surface-variant)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar documentos processados"
        />
      </div>

      {sortedDocuments.length > 0 ? (
        sortedDocuments.map(item => (
          <DataCard 
            key={item.id} 
            item={item} 
            onDelete={onDeleteDocument}
            onUpdateClient={onUpdateClient}
            onDeleteClient={onDeleteClient}
            onAddClient={onAddClient}
            onUpdateProperty={onUpdateProperty}
            onDeleteProperty={onDeleteProperty}
            onAddProperty={onAddProperty}
            onUpdateCompany={onUpdateCompany}
            onDeleteCompany={onDeleteCompany}
            onAddCompany={onAddCompany}
            setGlobalError={setGlobalError}
          />
        ))
      ) : (
        <div className="mt-12 text-center text-[var(--md-sys-color-on-surface-variant)] py-12 bg-[var(--md-sys-color-surface-container-low)] shadow-lg rounded-[var(--md-sys-shape-corner-large)] border border-[var(--md-sys-color-outline-variant)]">
          <SearchIcon className="w-20 h-20 mx-auto mb-6 text-[var(--md-sys-color-secondary)] opacity-70" />
          <p className="text-2xl font-medium mb-2">Nenhum resultado encontrado.</p>
          <p className="text-base">Sua busca por "{searchTerm}" não retornou documentos.</p>
          <p className="text-base">Tente um termo diferente ou limpe a busca.</p>
        </div>
      )}
    </div>
  );
};

export default DataDisplay;