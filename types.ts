

export enum ClientType {
  COMPRADOR = 'Comprador',
  VENDEDOR = 'Vendedor',
  LOCADOR = 'Locador',
  LOCATARIO = 'Locatário',
  TESTEMUNHA = 'Testemunha',
  CONJUGE = 'Cônjuge',
  INTERESSADO = 'Interessado',
  PROCURADOR = 'Procurador',
  FIADOR = 'Fiador',
  REPRESENTANTE_LEGAL = 'Representante Legal',
  PROPRIETARIO = 'Proprietário',
  PROFISSIONAL_LIBERAL = 'Profissional Liberal',
  PRESTADOR_SERVICO = 'Prestador de Serviço',
  OUTRO = 'Outro',
}

export interface ClientData {
  id: string; 
  nomeCompleto?: string;
  cpfCnpj?: string;
  rg?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  estadoCivil?: string;
  profissao?: string;
  tipoCliente?: ClientType | string; 
}

export interface PropertyData {
  id: string; 
  enderecoCompleto?: string;
  tipoImovel?: string;
  areaTotal?: string;
  areaConstruida?: string;
  numeroMatricula?: string;
  iptu?: string;
  valorVendaLocacao?: string;
  caracteristicas?: string;
}

export enum CompanyType {
  MATRIZ = 'Matriz',
  FILIAL = 'Filial',
  MEI = 'MEI',
  LTDA = 'LTDA',
  SA = 'S/A', // Sociedade Anônima
  EIRELI = 'EIRELI', // Extinta, mas pode aparecer em docs antigos
  SLU = 'SLU', // Sociedade Limitada Unipessoal
  ASSOCIACAO = 'Associação',
  COOPERATIVA = 'Cooperativa',
  FUNDACAO = 'Fundação',
  HOLDING = 'Holding',
  ESCRITORIO_ADVOCACIA = 'Escritório de Advocacia',
  CONSULTORIA = 'Consultoria',
  PRESTADOR_SERVICOS_GERAIS = 'Prestador de Serviços Gerais',
  OUTRO = 'Outro',
}

export interface CompanyData {
  id: string; // Unique ID for the company entry
  razaoSocial?: string;
  nomeFantasia?: string;
  cnpj?: string; // Formato XX.XXX.XXX/XXXX-XX
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  dataAbertura?: string; // Formato DD/MM/AAAA
  enderecoCompleto?: string; // Rua, número, complemento, bairro, cidade, estado, CEP
  telefone?: string;
  email?: string;
  ramoAtividade?: string; // Descrição do ramo
  cnaePrincipal?: string; // Código CNAE
  tipoEmpresa?: CompanyType | string;
  capitalSocial?: string;
  socios?: string; // Nomes dos sócios, se aplicável
}

export interface ExtractedData {
  clientes: ClientData[];
  imoveis: PropertyData[];
  empresas: CompanyData[];
}

export interface ProcessedDocument extends ExtractedData {
  id: string; 
  fileName: string;
  fileType: string;
  timestamp: string; 
}

export enum SupportedMimeTypes {
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  XML = 'text/xml',
  TXT = 'text/plain',
  CSV = 'text/csv',
}