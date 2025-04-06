import { useSettings } from '../context/SettingsContext';

interface SettingsPanelProps {
  closeSettings: () => void;
}

export default function SettingsPanel({ closeSettings }: SettingsPanelProps) {
  const { settings, updateSettings } = useSettings();

  const handleToggleChange = (key: keyof Settings) => {
    updateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleHeadingToggle = (level: 'h1' | 'h2' | 'h3' | 'h4') => {
    updateSettings({
      ...settings,
      enabledHeadings: {
        ...settings.enabledHeadings,
        [level]: !settings.enabledHeadings[level]
      }
    });
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({
      ...settings,
      position: e.target.value as 'popup' | 'right' | 'left'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-light">
          <h2 className="text-lg font-medium">Settings</h2>
          <button 
            className="p-1 rounded-full hover:bg-neutral-lighter"
            onClick={closeSettings}
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Display Options</h3>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Auto-scroll to section</span>
              <label className="relative inline-block w-8 h-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.autoScroll}
                  onChange={() => handleToggleChange('autoScroll')}
                />
                <div className="w-8 h-4 bg-neutral-light rounded-full"></div>
                <div className={`absolute left-0 top-0 w-4 h-4 bg-primary rounded-full transform ${settings.autoScroll ? 'translate-x-4' : 'translate-x-0'} transition-transform`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Smooth scrolling</span>
              <label className="relative inline-block w-8 h-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.smoothScroll}
                  onChange={() => handleToggleChange('smoothScroll')}
                />
                <div className="w-8 h-4 bg-neutral-light rounded-full"></div>
                <div className={`absolute left-0 top-0 w-4 h-4 bg-primary rounded-full transform ${settings.smoothScroll ? 'translate-x-4' : 'translate-x-0'} transition-transform`}></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Show heading indicators</span>
              <label className="relative inline-block w-8 h-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={settings.showHeadingLabels}
                  onChange={() => handleToggleChange('showHeadingLabels')}
                />
                <div className="w-8 h-4 bg-neutral-light rounded-full"></div>
                <div className={`absolute left-0 top-0 w-4 h-4 bg-primary rounded-full transform ${settings.showHeadingLabels ? 'translate-x-4' : 'translate-x-0'} transition-transform`}></div>
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Heading Levels</h3>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="h1" 
                  className="mr-2" 
                  checked={settings.enabledHeadings.h1}
                  onChange={() => handleHeadingToggle('h1')}
                />
                <label htmlFor="h1" className="text-sm">H1 Headings</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="h2" 
                  className="mr-2" 
                  checked={settings.enabledHeadings.h2}
                  onChange={() => handleHeadingToggle('h2')}
                />
                <label htmlFor="h2" className="text-sm">H2 Headings</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="h3" 
                  className="mr-2" 
                  checked={settings.enabledHeadings.h3}
                  onChange={() => handleHeadingToggle('h3')}
                />
                <label htmlFor="h3" className="text-sm">H3 Headings</label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="h4" 
                  className="mr-2" 
                  checked={settings.enabledHeadings.h4}
                  onChange={() => handleHeadingToggle('h4')}
                />
                <label htmlFor="h4" className="text-sm">H4 Headings</label>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Appearance</h3>
            <div className="mb-3">
              <label className="text-sm block mb-1">Outline position</label>
              <select 
                className="w-full p-2 border border-neutral-light rounded text-sm"
                value={settings.position}
                onChange={handlePositionChange}
              >
                <option value="popup">Popup</option>
                <option value="right">Right sidebar</option>
                <option value="left">Left sidebar</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-neutral-light mt-3">
          <button 
            className="w-full bg-primary text-white py-2 rounded text-sm font-medium"
            onClick={closeSettings}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
