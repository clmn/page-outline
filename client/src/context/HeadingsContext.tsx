import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { sendMessageToContent, addMessageListener } from '../lib/chromeUtils';
import type { Heading, CurrentPage, MessageToPopup } from '../lib/types';

interface HeadingsContextType {
  headings: Heading[];
  currentHeading?: Heading;
  currentPage?: CurrentPage;
  loading: boolean;
  refreshOutline: () => void;
  navigateToHeading: (headingId: string) => void;
}

const HeadingsContext = createContext<HeadingsContextType>({
  headings: [],
  loading: true,
  refreshOutline: () => {},
  navigateToHeading: () => {}
});

export const useHeadings = () => useContext(HeadingsContext);

interface HeadingsProviderProps {
  children: ReactNode;
}

export const HeadingsProvider = ({ children }: HeadingsProviderProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [currentHeading, setCurrentHeading] = useState<Heading | undefined>();
  const [currentPage, setCurrentPage] = useState<CurrentPage | undefined>();
  const [loading, setLoading] = useState(true);

  const refreshOutline = async () => {
    setLoading(true);
    await sendMessageToContent({ action: 'refreshOutline' });
  };

  const navigateToHeading = async (headingId: string) => {
    await sendMessageToContent({ action: 'navigateToHeading', headingId });
  };

  useEffect(() => {
    const handleMessage = (message: MessageToPopup) => {
      switch (message.action) {
        case 'headingsFound':
          if (message.headings) {
            setHeadings(message.headings);
            setLoading(false);
          }
          if (message.currentPage) {
            setCurrentPage(message.currentPage);
          }
          break;
        case 'currentHeadingChanged':
          if (message.currentHeading) {
            setCurrentHeading(message.currentHeading);
          }
          break;
        case 'noHeadingsFound':
          setHeadings([]);
          setLoading(false);
          if (message.currentPage) {
            setCurrentPage(message.currentPage);
          }
          break;
      }
    };

    // Add listener for messages from content script
    const removeListener = addMessageListener(handleMessage);

    // Request headings when popup loads
    const initializeHeadings = async () => {
      await sendMessageToContent({ action: 'getHeadings' });
    };

    initializeHeadings();

    return () => {
      removeListener();
    };
  }, []);

  return (
    <HeadingsContext.Provider value={{
      headings,
      currentHeading,
      currentPage,
      loading,
      refreshOutline,
      navigateToHeading
    }}>
      {children}
    </HeadingsContext.Provider>
  );
};
