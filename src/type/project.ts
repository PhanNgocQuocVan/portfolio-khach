export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  category?: string[]; // "dev" | "design" | "vui" — dùng cho FilterSelect
  software?: string[]; // "Revit" | "SketchUp"... — dùng cho Dock filter
  link?: string;
}
