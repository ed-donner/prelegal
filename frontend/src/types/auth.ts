export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface SavedDocument {
  id: number;
  document_type: string;
  title: string;
  form_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DocumentListResponse {
  documents: SavedDocument[];
}
