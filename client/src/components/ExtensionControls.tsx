import { useSettings } from '../context/SettingsContext';
import { useHeadings } from '../context/HeadingsContext';

export default function ExtensionControls() {
  const { settings, updateSettings } = useSettings();
  const { refreshOutline } = useHeadings();

  const handleAutoScrollToggle = () => {
    updateSettings({
      ...settings,
      autoScroll: !settings.autoScroll
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-neutral-lighter">
      <button 
        className="flex items-center text-sm text-primary hover:bg-secondary px-2 py-1 rounded"
        onClick={refreshOutline}
      >
        <span className="material-icons text-sm mr-1">refresh</span>
        Refresh
      </button>
      
      <div className="flex items-center">
        <span className="text-sm text-neutral-medium mr-2">Auto-scroll</span>
        <label className="relative inline-block w-8 h-4 cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={settings.autoScroll}
            onChange={handleAutoScrollToggle}
          />
          <div className="w-8 h-4 bg-neutral-light rounded-full"></div>
          <div className={`absolute left-0 top-0 w-4 h-4 bg-primary rounded-full transform ${settings.autoScroll ? 'translate-x-4' : 'translate-x-0'} transition-transform`}></div>
        </label>
      </div>
    </div>
  );
}
