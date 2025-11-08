// frontend/app/types/finley.d.ts

export type SplitterItem = {
  name: string;
  upi: string;
  balance: number; // ✅ required for all items
};

export type SplitterHistory = {
  to: string;
  amount: number;
  time: number;
};

export type Splitter = {
  id: number;
  title: string;
  items: SplitterItem[];
  history: SplitterHistory[];
};
