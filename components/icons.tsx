
import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
  </svg>
);

export const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Ícone de Imóvel/Casa (minimalista, inspirado em Material Icons "Home")
export const BuildingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z"/>
  </svg>
);

// Ícone de Empresa/Escritório (minimalista, inspirado em Material Icons "Domain")
export const CompanyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
     <path d="M6 2H18C19.1 2 20 2.9 20 4V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V4C4 2.9 4.9 2 6 2M8 6V8H16V6H8M8 10V12H16V10H8M8 14V16H12V14H8Z"/>
  </svg>
);


export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

export const LoadingSpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`animate-spin ${className || "w-5 h-5"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M0 0h24v24H0V0z" fill="none"/>
    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
  </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

export const CancelIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const AddIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// Updated Theme Icons (Minimalist)
// Ícone Sol (minimalista, inspirado em Heroicons v2 Sun)
export const LightModeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M10.5 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM10.5 18.75a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V19.5a.75.75 0 01.75-.75zM2.25 10.5a.75.75 0 01.75.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zm18.75 0a.75.75 0 01.75.75h2.25a.75.75 0 010 1.5H19.5a.75.75 0 01-.75-.75zM4.136 4.136a.75.75 0 011.06 0l1.768 1.768a.75.75 0 01-1.06 1.06L4.136 5.197a.75.75 0 010-1.06zm14.142 14.142a.75.75 0 011.06 0l1.768 1.768a.75.75 0 01-1.06 1.06l-1.768-1.768a.75.75 0 010-1.06zm-14.142 0a.75.75 0 010 1.06l-1.768 1.768a.75.75 0 01-1.06-1.06l1.768-1.768a.75.75 0 011.06 0zm14.142-14.142a.75.75 0 010 1.06l-1.768 1.768a.75.75 0 01-1.06-1.06l1.768-1.768a.75.75 0 011.06 0zM12 6.75a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" clipRule="evenodd" />
  </svg>
);

// Ícone Lua (minimalista, inspirado em Material Design Icons "DarkMode")
export const DarkModeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M10 2c-1.82 0-3.53.5-5 1.35 2.99 1.73 5 4.95 5 8.65s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z"/>
  </svg>
);

export const SystemModeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V6ZM6 6V16H18V6H6Z"/>
    <path d="M10 20C10 19.4477 10.4477 19 11 19H13C13.5523 19 14 19.4477 14 20C14 20.5523 13.5523 21 13 21H11C10.4477 21 10 20.5523 10 20Z"/>
  </svg>
);


export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
  </svg>
);

export const ExportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

// Updated Copy Icon
export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
  </svg>
);


export const CopySuccessIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Icons for text case manipulation
export const LetterCaseUppercaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M3.303 4.003A.75.75 0 014.003 3.3h8.244a.75.75 0 010 1.5H9.753v10.45a.75.75 0 01-1.5 0V4.8H4.003a.75.75 0 01-.7-.797zM12.753 4.8H11.5a.75.75 0 000 1.5h.503v2.95H11.5a.75.75 0 000 1.5h.503v2.95H11.5a.75.75 0 000 1.5h.503v2.95H11.5a.75.75 0 000 1.5h1.253a.75.75 0 00.75-.75V4.053a.75.75 0 00-.75-.75z" />
     <path d="M15.997 3.303a.75.75 0 00-1.06 0L12.25 6h2.061l1-1.25h-1.06v-.697h.001zm-1.061 1.5L12.25 7.5h2.061l1-1.25h-1.06V6.053h.001zM13 16.7V4.053h1.25a.75.75 0 01.53 1.28l-2.47 3.088a.75.75 0 010 .964l2.47 3.088a.75.75 0 01-.53 1.28H13v2.947a.75.75 0 01-1.5 0V4.053a.75.75 0 01.75-.75h3.506a.75.75 0 01.53 1.28L14.03 7.67a.75.75 0 010 .964l2.756 3.088a.75.75 0 01-.53 1.28H13v2.947a.75.75 0 01-1.5 0z" fillOpacity="0" />
  </svg>
);

export const LetterCaseLowercaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M5.083 15.95A.75.75 0 014.02 15.5h-.001a3.25 3.25 0 010-6.5H5V4.75a.75.75 0 011.5 0V9h.75a.75.75 0 010 1.5H6.5v2.75a1.75 1.75 0 003.5 0V9a.75.75 0 011.5 0v3.25a3.25 3.25 0 01-6.417 1.7zM11.5 15.25a.75.75 0 000-1.5h-.75v-2.75a1.75 1.75 0 013.5 0V15h.75a.75.75 0 000-1.5h-2.5a3.25 3.25 0 00-3.25-3.25H9.5a.75.75 0 000 1.5h.25v5.25a.75.75 0 00.75.75h2.5z" />
     <path d="M13.717 15.95a.75.75 0 01-1.063-.452h-.001a3.25 3.25 0 01-3.171-4.752A3.25 3.25 0 0112.654 7.5h.1V4.75a.75.75 0 011.5 0V7.5h.75a.75.75 0 010 1.5H13.5v2.75a1.75 1.75 0 003.5 0V9a.75.75 0 011.5 0v2.75a3.25 3.25 0 01-4.783 4.2z" fillOpacity="0" />
  </svg>
);

export const LetterCaseTitleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M3.303 4.003A.75.75 0 014.003 3.3h3.744a.75.75 0 010 1.5H5.503v10.45a.75.75 0 01-1.5 0V4.8H4.003a.75.75 0 01-.7-.797zM8.5 15.25a.75.75 0 000-1.5h-.75V9.5a1.75 1.75 0 013.5 0V15h.75a.75.75 0 000-1.5H10A3.25 3.25 0 006.75 10H6a.75.75 0 000 1.5h.75v3.75a.75.75 0 00.75.75H8.5z" />
    <path d="M12.217 15.95a.75.75 0 01-1.063-.452h-.001a3.25 3.25 0 01-3.171-4.752A3.25 3.25 0 0111.154 7.5h.1V4.75a.75.75 0 011.5 0V7.5h.75a.75.75 0 010 1.5H12V12a1.75 1.75 0 003.5 0V9.25a.75.75 0 011.5 0V12a3.25 3.25 0 01-4.783 4.2z" fillOpacity="0.7"/>
  </svg>
);