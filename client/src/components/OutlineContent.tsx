import { useHeadings } from '../context/HeadingsContext';
import type { Heading, CurrentPage } from '../lib/types';

interface OutlineContentProps {
  headings: Heading[];
  currentHeading?: Heading;
  currentPage?: CurrentPage;
}

export default function OutlineContent({ headings, currentHeading, currentPage }: OutlineContentProps) {
  const { navigateToHeading } = useHeadings();
  
  const getPaddingByLevel = (level: number) => {
    switch(level) {
      case 1: return '';
      case 2: return 'pl-6';
      case 3: return 'pl-10';
      case 4: return 'pl-14';
      default: return '';
    }
  };
  
  const getMarginByLevel = (level: number, prevLevel?: number) => {
    if (prevLevel === undefined) return '';
    if (level === 1 && prevLevel !== 1) return 'mt-3';
    if (level >= prevLevel) return 'mt-1';
    return 'mt-2';
  };
  
  const getBgOpacityByLevel = (level: number) => {
    switch(level) {
      case 1: return '';
      case 2: return '/90';
      case 3: return '/80';
      case 4: return '/70';
      default: return '';
    }
  };
  
  return (
    <div className="extension-body p-4 max-h-[600px] overflow-y-auto">
      <div className="mb-3">
        <div className="text-sm text-neutral-medium mb-2">
          Current page: <span className="font-medium">{currentPage?.title || 'Loading...'}</span>
        </div>
        <div className="text-xs text-neutral-medium">
          Found <span className="font-medium text-primary">{headings.length}</span> headings
        </div>
      </div>

      <div className="outline-tree">
        {headings.map((heading, index) => {
          const prevHeading = index > 0 ? headings[index - 1] : undefined;
          const isActive = currentHeading?.id === heading.id;
          
          return (
            <div 
              key={heading.id}
              className={`outline-item flex py-1.5 px-2 rounded cursor-pointer hover:bg-secondary group ${getPaddingByLevel(heading.level)} ${getMarginByLevel(heading.level, prevHeading?.level)} ${isActive ? 'bg-secondary' : ''}`}
              data-heading-level={heading.level}
              onClick={() => navigateToHeading(heading.id)}
            >
              <div className="mr-2 flex items-start">
                <span className={`inline-block px-1.5 py-0.5 bg-primary${getBgOpacityByLevel(heading.level)} text-white text-xs rounded`}>
                  H{heading.level}
                </span>
              </div>
              <div className="flex-grow">
                <div className={`${heading.level === 1 ? 'text-base' : (heading.level === 4 ? 'text-xs' : 'text-sm')} font-medium truncate`}>
                  {heading.text}
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-icons text-primary text-sm">link</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
