export interface Heading {
  id: string;
  text: string;
  level: number;
  element: HTMLHeadingElement;
}

export interface CurrentPage {
  title: string;
  url: string;
}

export interface Settings {
  autoScroll: boolean;
  smoothScroll: boolean;
  showHeadingLabels: boolean;
  position: 'popup' | 'right' | 'left';
  enabledHeadings: {
    h1: boolean;
    h2: boolean;
    h3: boolean;
    h4: boolean;
  };
}

export interface MessageToContent {
  action: 'getHeadings' | 'navigateToHeading' | 'refreshOutline';
  headingId?: string;
}

export interface MessageToPopup {
  action: 'headingsFound' | 'currentHeadingChanged' | 'noHeadingsFound';
  headings?: Heading[];
  currentHeading?: Heading;
  currentPage?: CurrentPage;
}
