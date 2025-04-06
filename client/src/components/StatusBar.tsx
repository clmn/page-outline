import type { Heading } from '../lib/types';

interface StatusBarProps {
  currentHeading?: Heading;
  hasAnchors: boolean;
}

export default function StatusBar({ currentHeading, hasAnchors }: StatusBarProps) {
  return (
    <div className="py-2 px-4 border-t border-neutral-light flex items-center justify-between bg-white text-xs text-neutral-medium">
      <div className="flex items-center">
        {hasAnchors ? (
          <>
            <span className="material-icons text-success text-sm mr-1">check_circle</span>
            <span>Anchors added</span>
          </>
        ) : (
          <>
            <span className="material-icons text-neutral-medium text-sm mr-1">info</span>
            <span>No anchors added</span>
          </>
        )}
      </div>
      {currentHeading && (
        <div>
          Current: <span className="font-medium">{currentHeading.text}</span>
        </div>
      )}
    </div>
  );
}
