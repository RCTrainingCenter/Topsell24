export type AdminTabConfig = {
  id: string;
  label: string;
  [key: string]: any;
};

export type AdminBannerConfig = {
  id: string;
  title?: string;
  imageUrl?: string;
  [key: string]: any;
};

export type AdminQuote = {
  id: string;
  [key: string]: any;
};

export type AdminOrder = {
  id: string;
  [key: string]: any;
};

export interface AdminPanelProps {
  onClose?: () => void;
  [key: string]: any;
}

export default function AdminPanel(_props: AdminPanelProps) {
  return null;
}
