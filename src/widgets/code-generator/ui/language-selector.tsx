'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/shared/ui/dropdown-menu';
import { SupportedLanguage } from '@/src/entities/code-snippet';
import { languageConfigs, getLanguageConfig } from '@/src/entities/code-snippet';

type LanguageSelectorProps = {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
};

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentConfig = getLanguageConfig(selectedLanguage);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='gap-2 min-w-[160px]'>
          <span>{currentConfig.icon}</span>
          <span>{currentConfig.label}</span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-[200px]' align='start'>
        {Object.values(languageConfigs).map(config => (
          <DropdownMenuItem
            key={config.id}
            onClick={() => onLanguageChange(config.id)}
            className='gap-3 py-3'
          >
            <span className='text-lg'>{config.icon}</span>
            <div className='flex-1'>
              <div className='font-medium'>{config.label}</div>
              <div className='text-xs text-gray-500 truncate'>{config.description}</div>
            </div>
            {selectedLanguage === config.id && <Check size={16} className='text-green-600' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
