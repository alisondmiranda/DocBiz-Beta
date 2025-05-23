
import { ClientType, CompanyType } from './types';

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpeg', '.jpg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/xml': ['.xml'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],
};

export const MAX_FILE_SIZE_MB = 10; // Max file size in MB
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const CLIENT_TYPES: string[] = Object.values(ClientType);
export const COMPANY_TYPES: string[] = Object.values(CompanyType);