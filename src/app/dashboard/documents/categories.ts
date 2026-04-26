export const DOCUMENT_CATEGORIES = [
  { id: "tax_returns", label: "Tax Returns" },
  { id: "financial_statements", label: "Financial Statements" },
  { id: "bylaws", label: "Bylaws" },
  { id: "articles", label: "Articles of Incorporation" },
  { id: "board_minutes", label: "Board Minutes" },
  { id: "beach_house", label: "Beach House" },
  { id: "other", label: "Other" },
] as const;

export type DocumentCategoryId = (typeof DOCUMENT_CATEGORIES)[number]["id"];

export function categoryLabel(id: string) {
  return (
    DOCUMENT_CATEGORIES.find((c) => c.id === id)?.label ?? id
  );
}
