export interface PropertyImage {
  id_imagen: number;
  url: string;
}

export interface PropertyFeature {
  nombre: string;
  valor: string;
}

export interface PropertyCatalogItem {
  id_propiedad: number;
  id_empresa: number;
  titulo: string;
  direccion: string;
  precio: number;
  tipo_operacion: string; // 'Venta', 'Alquiler', 'Anticretico'
  estado: string; // 'Disponible', 'Reservada', 'Vendida', 'Alquilada'
  imagenes: PropertyImage[];
  caracteristicas: PropertyFeature[];
}

export interface PropertyFilterParams {
  tipo_operacion?: string;
  precio_min?: number;
  precio_max?: number;
  cuartos?: number;
  banos?: number;
  salas?: number;
  metros_min?: number;
  metros_max?: number;
  zona?: string;
  amueblado?: boolean;
  servicios_basicos?: boolean;
}
