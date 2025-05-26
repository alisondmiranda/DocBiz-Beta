
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME, CLIENT_TYPES, COMPANY_TYPES } from '../constants';
import { ExtractedData, ClientData, PropertyData, CompanyData } from '../types';


const EXTRACTION_PROMPT_INSTRUCTIONS = `Você é um assistente de IA altamente especializado em analisar documentos diversos para extrair informações detalhadas sobre clientes (pessoas físicas), empresas (pessoas jurídicas) e propriedades (imóveis). Sua principal tarefa é identificar e extrair os dados relevantes do documento fornecido, que pode ser uma imagem (JPEG, PNG), PDF, DOC, DOCX, XML, TXT ou CSV.

Primeiro, se o documento for uma imagem ou PDF escaneado, realize um OCR para converter o conteúdo visual em texto. Em seguida, analise o texto completo do documento.

Identifique e extraia os seguintes dados, estruturando-os OBRIGATORIAMENTE no formato JSON especificado abaixo.

Dados do Cliente (Pessoa Física) a serem extraídos (campos opcionais, preencher se encontrados):
- nomeCompleto: Nome completo do cliente.
- cpfCnpj: CPF (formato XXX.XXX.XXX-XX). Se for um CNPJ de um MEI onde o titular é claramente o foco como pessoa física, pode ser incluído aqui também se o contexto indicar.
- rg: Número do RG do cliente.
- endereco: Endereço residencial completo do cliente (rua, número, complemento, bairro, cidade, estado, CEP).
- telefone: Número de telefone pessoal do cliente (com DDD).
- email: Endereço de e-mail pessoal do cliente.
- estadoCivil: Estado civil do cliente (ex: Solteiro(a), Casado(a), Divorciado(a), Viúvo(a)).
- profissao: Profissão do cliente.
- tipoCliente: Tipo de relação do cliente com o documento ou transação. Valores possíveis: ${CLIENT_TYPES.join(', ')}. Se não puder determinar com clareza, use "Outro" ou deixe como null.

Dados da Empresa (Pessoa Jurídica) a serem extraídos (campos opcionais, preencher se encontrados):
- razaoSocial: Razão Social completa da empresa.
- nomeFantasia: Nome Fantasia da empresa, se houver.
- cnpj: CNPJ da empresa (formato XX.XXX.XXX/XXXX-XX).
- inscricaoEstadual: Número da Inscrição Estadual, se aplicável.
- inscricaoMunicipal: Número da Inscrição Municipal, se aplicável.
- dataAbertura: Data de fundação/abertura da empresa (formato DD/MM/AAAA).
- enderecoCompleto: Endereço comercial completo da empresa (rua, número, complemento, bairro, cidade, estado, CEP).
- telefone: Número de telefone comercial da empresa (com DDD).
- email: Endereço de e-mail comercial/oficial da empresa.
- ramoAtividade: Descrição do principal ramo de atividade ou setor da empresa.
- cnaePrincipal: Código CNAE (Classificação Nacional de Atividades Econômicas) principal.
- tipoEmpresa: Natureza jurídica ou tipo societário da empresa. Valores possíveis: ${COMPANY_TYPES.join(', ')}. Se não puder determinar, use "Outro" ou deixe como null.
- capitalSocial: Valor do capital social da empresa (ex: "R$ 100.000,00").
- socios: Nomes dos sócios ou administradores principais, se mencionados de forma clara.

Dados do Imóvel a serem extraídos (campos opcionais, preencher se encontrados):
- enderecoCompleto: Endereço completo do imóvel (rua, número, complemento, bairro, cidade, estado, CEP).
- tipoImovel: Tipo do imóvel (ex: Casa, Apartamento, Terreno, Sala Comercial, Loja, Galpão, Sítio, Fazenda).
- areaTotal: Área total do imóvel (ex: "120 m²", "1.000 ha").
- areaConstruida: Área construída do imóvel (ex: "80 m²"). Se não aplicável (ex: terreno), omitir.
- numeroMatricula: Número da matrícula do imóvel no Cartório de Registro de Imóveis.
- iptu: Número de inscrição do IPTU ou valor do IPTU anual/mensal.
- valorVendaLocacao: Valor de venda ou locação do imóvel (ex: "R$ 500.000,00", "R$ 2.500,00/mês").
- caracteristicas: Outras características relevantes (ex: "3 quartos, 2 banheiros, 1 vaga de garagem", "Piscina, churrasqueira", "Frente para o mar", "Com escritura pública").

Formato de Saída JSON ESTRITO (NÃO inclua comentários no JSON de saída, NÃO use \`\`\`json ... \`\`\` para envelopar a saída, apenas o JSON puro):
{
  "clientes": [
    {
      "nomeCompleto": "string | null",
      "cpfCnpj": "string | null",
      "rg": "string | null",
      "endereco": "string | null",
      "telefone": "string | null",
      "email": "string | null",
      "estadoCivil": "string | null",
      "profissao": "string | null",
      "tipoCliente": "string | null"
    }
  ],
  "empresas": [
    {
      "razaoSocial": "string | null",
      "nomeFantasia": "string | null",
      "cnpj": "string | null",
      "inscricaoEstadual": "string | null",
      "inscricaoMunicipal": "string | null",
      "dataAbertura": "string | null",
      "enderecoCompleto": "string | null",
      "telefone": "string | null",
      "email": "string | null",
      "ramoAtividade": "string | null",
      "cnaePrincipal": "string | null",
      "tipoEmpresa": "string | null",
      "capitalSocial": "string | null",
      "socios": "string | null"
    }
  ],
  "imoveis": [
    {
      "enderecoCompleto": "string | null",
      "tipoImovel": "string | null",
      "areaTotal": "string | null",
      "areaConstruida": "string | null",
      "numeroMatricula": "string | null",
      "iptu": "string | null",
      "valorVendaLocacao": "string | null",
      "caracteristicas": "string | null"
    }
  ]
}

Considerações Importantes:
- Se uma informação específica não for encontrada no documento, omita o campo correspondente no JSON ou atribua o valor null.
- Se nenhuma entidade (cliente, empresa ou imóvel) for identificada, o array correspondente deve ser vazio ([]).
- Preste muita atenção aos formatos de CPF/CNPJ, datas e outros dados numéricos ou específicos.
- Extraia os dados EXATAMENTE como aparecem no documento, se possível, ou normalize-os de forma inteligente (ex: datas, valores monetários).
- Para os campos "tipoCliente" e "tipoEmpresa", escolha o valor mais apropriado da lista fornecida ou "Outro".
- Se um documento contiver informações sobre múltiplas entidades do mesmo tipo (ex: vários clientes), crie um objeto para cada uma delas dentro do array correspondente.

Analise o documento fornecido a seguir e retorne APENAS o objeto JSON. Não inclua nenhum texto explicativo antes ou depois do JSON.`;


export const extractDataFromDocument = async (
  apiKey: string, // New parameter
  fileContent: string,
  mimeType: string
): Promise<ExtractedData> => {
  try {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') { // New check
      throw new Error("Chave de API do Gemini não fornecida ou inválida.");
    }
    const ai = new GoogleGenAI({ apiKey: apiKey }); // New initialization
    let documentPart;
    if (mimeType.startsWith('text/')) {
      documentPart = { text: fileContent };
    } else {
      const base64Data = fileContent.split(',')[1];
      if (!base64Data) {
        throw new Error('Formato de dados inválido para arquivo não textual.');
      }
      documentPart = {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      };
    }

    const requestParams: GenerateContentParameters = {
      model: GEMINI_MODEL_NAME,
      contents: [
        {
          parts: [
            documentPart,
            { text: EXTRACTION_PROMPT_INSTRUCTIONS }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        temperature: 0.1, 
        topK: 32,
        topP: 0.9,
      },
    };

    const result: GenerateContentResponse = await ai.models.generateContent(requestParams);
    // FIX: Accessing .text property is correct as per guidelines for GenerateContentResponse.
    // The error "This expression is not callable. Type 'String' has no call signatures."
    // on this line, if the code is `result.text`, suggests an external issue (e.g., environment, tooling)
    // or a misreported line number for a different problem.
    const responseText = result.text;
    
    let jsonStr = responseText.trim();
    // Gemini pode, às vezes, ainda envolver em ```json ... ``` mesmo com responseMimeType: "application/json"
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", e);
      console.error("Raw Gemini response text:", responseText);
      throw new Error("Não foi possível analisar os dados extraídos pela IA. O formato da resposta pode ser inválido ou o conteúdo do documento não é suportado para extração.");
    }
    
    // Ensure basic structure and add IDs
    const validatedData: ExtractedData = {
        clientes: (parsedData.clientes && Array.isArray(parsedData.clientes)) 
            ? parsedData.clientes.map((c: Partial<ClientData>) => ({ ...c, id: crypto.randomUUID() })) 
            : [],
        imoveis: (parsedData.imoveis && Array.isArray(parsedData.imoveis)) 
            ? parsedData.imoveis.map((p: Partial<PropertyData>) => ({ ...p, id: crypto.randomUUID() })) 
            : [],
        empresas: (parsedData.empresas && Array.isArray(parsedData.empresas))
            ? parsedData.empresas.map((e: Partial<CompanyData>) => ({ ...e, id: crypto.randomUUID() }))
            : [],
    };
    
    if (!parsedData.clientes || !parsedData.imoveis || !parsedData.empresas) {
        console.warn("API returned valid JSON but missing 'clientes', 'imoveis', or 'empresas' arrays:", parsedData);
    }

    return validatedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Consider updating the error message to be more generic or specifically reference the user-provided key
    if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API_KEY") || error.message.includes("Chave de API") || error.message.includes("API key"))) { // Example check
        throw new Error("Chave de API do Gemini inválida ou com problemas. Verifique a chave fornecida e tente novamente.");
    }
    throw new Error("Erro ao processar o documento com a IA. Verifique o console para mais detalhes ou tente novamente mais tarde.");
  }
};