export interface Permission {
  id_permiso: number;
  codigo: string;
  descripcion?: string | null;
  tipo: string; // 'UI_Menu', 'UI_Boton', 'Endpoint'
}

export interface PermissionCreateRequest {
  codigo: string;
  descripcion?: string;
  tipo: string;
}
