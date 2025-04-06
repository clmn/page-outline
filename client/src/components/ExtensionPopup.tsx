import { useEffect, useState } from 'react';
import ExtensionHeader from './ExtensionHeader';
import ExtensionControls from './ExtensionControls';
import EmptyState from './EmptyState';
import OutlineContent from './OutlineContent';
import StatusBar from './StatusBar';
import SettingsPanel from './SettingsPanel';
import { useHeadings } from '../context/HeadingsContext';

export default function ExtensionPopup() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { headings, currentHeading, currentPage, loading } = useHeadings();

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const closePopup = () => {
    if (typeof chrome !== 'undefined' && chrome.extension) {
      window.close();
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white rounded shadow-lg">
      <ExtensionHeader 
        openSettings={openSettings} 
        closePopup={closePopup} 
      />
      
      <ExtensionControls />
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {(!headings || headings.length === 0) ? (
            <EmptyState />
          ) : (
            <OutlineContent 
              headings={headings} 
              currentHeading={currentHeading}
              currentPage={currentPage}
            />
          )}
        </>
      )}
      
      <StatusBar 
        currentHeading={currentHeading} 
        hasAnchors={headings && headings.length > 0}
      />
      
      {isSettingsOpen && (
        <SettingsPanel closeSettings={closeSettings} />
      )}
    </div>
  );
}
