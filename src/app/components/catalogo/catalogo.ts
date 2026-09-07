import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-catalogo',
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit {
  propiedades: any[] = [];
  
  filtroOperacion: string = '';
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let params: any = {};
    if (this.filtroOperacion) params.tipo_operacion = this.filtroOperacion;
    if (this.filtroPrecioMin) params.precio_min = this.filtroPrecioMin;
    if (this.filtroPrecioMax) params.precio_max = this.filtroPrecioMax;
    
    params.estado = 'Disponible';

    this.http.get('http://localhost:8000/modulo_inmuebles/propiedades/catalogo', { params })
      .subscribe((res: any) => this.propiedades = res);
  }
}
