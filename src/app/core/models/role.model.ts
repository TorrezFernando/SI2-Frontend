export interface Role {
  id_rol: number;
  nombre: string;
  id_empresa: number | null;
  permisos: number[];
}

export interface RoleCreateRequest {
  nombre: string;
  id_empresa?: number | null;
}
