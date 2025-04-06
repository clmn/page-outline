interface ExtensionHeaderProps {
  openSettings: () => void;
  closePopup: () => void;
}

export default function ExtensionHeader({ openSettings, closePopup }: ExtensionHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-light">
      <div className="flex items-center">
        <span className="material-icons text-primary mr-2">toc</span>
        <h1 className="text-lg font-medium">PageOutliner</h1>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          className="p-1 rounded-full hover:bg-neutral-lighter" 
          title="Settings"
          onClick={openSettings}
        >
          <span className="material-icons text-neutral-medium">settings</span>
        </button>
        <button 
          className="p-1 rounded-full hover:bg-neutral-lighter" 
          title="Close"
          onClick={closePopup}
        >
          <span className="material-icons text-neutral-medium">close</span>
        </button>
      </div>
    </header>
  );
}
