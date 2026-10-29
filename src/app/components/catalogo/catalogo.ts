import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-catalogo',
  templateUrl: './catalogo.html',
})
export class Catalogo implements OnInit, OnDestroy {
  propiedades: any[] = [];
  private refreshTimer: ReturnType<typeof setInterval> | null = null;
  
  filtroOperacion: string = '';
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;
  
  // Advanced filters
  filtroCuartos: number | null = null;
  filtroBanos: number | null = null;
  filtroSalas: number | null = null;
  filtroMetrosMin: number | null = null;
  filtroMetrosMax: number | null = null;
  filtroZona: string = '';
  filtroAmueblado: boolean = false;
  filtroServicios: boolean = false;
  mostrarFiltrosAvanzados: boolean = false;
  
  // Detalle Modal
  propiedadSeleccionada: any = null;
  mostrarModalDetalle: boolean = false;
  
  toggleFiltrosAvanzados() {
    this.mostrarFiltrosAvanzados = !this.mostrarFiltrosAvanzados;
  }
  
  abrirDetalles(prop: any) {
    this.propiedadSeleccionada = prop;
    this.mostrarModalDetalle = true;
  }

  cerrarDetalles() {
    this.mostrarModalDetalle = false;
    this.propiedadSeleccionada = null;
  }

  // Asistente Chatbot IA
  mostrarChat: boolean = false;
  chatMensajes: {role: string, content: string}[] = [];
  chatInput: string = '';
  cargandoChat: boolean = false;

  toggleChat() {
    this.mostrarChat = !this.mostrarChat;
    if (this.mostrarChat && this.chatMensajes.length === 0) {
      this.chatMensajes.push({role: 'model', content: '¡Hola! Soy tu Asistente Mágico ✨. Dime, ¿qué tipo de propiedad estás buscando? (Ej. Busco una casa en Venta con presupuesto de 100 mil)'});
    }
  }

  enviarMensaje() {
    if (!this.chatInput.trim()) return;
    const msg = this.chatInput.trim();
    this.chatMensajes.push({role: 'user', content: msg});
    this.chatInput = '';
    this.cargandoChat = true;
    
    // We send only the current message, history is optional for our basic prompt right now
    this.http.post('http://localhost:8000/api/ia/chat-catalogo', { mensaje: msg }, {headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))}).subscribe({
      next: (res: any) => {
        this.cargandoChat = false;
        if (res.success) {
          this.chatMensajes.push({role: 'model', content: res.respuesta});
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargandoChat = false;
        this.chatMensajes.push({role: 'model', content: 'Hubo un error al contactar al asistente. Intenta de nuevo más tarde.'});
        this.cdr.detectChanges();
      }
    });
  }

  constructor(private http: HttpClient, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.aplicarFiltros();
    this.connectWebSocket();
  }

  connectWebSocket() {
    this.refreshTimer = setInterval(() => this.aplicarFiltros(), 30000);
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  aplicarFiltros() {
    let params: any = {};
    if (this.filtroOperacion) params.tipo_operacion = this.filtroOperacion;
    if (this.filtroPrecioMin) params.precio_min = this.filtroPrecioMin;
    if (this.filtroPrecioMax) params.precio_max = this.filtroPrecioMax;
    
    // Advanced filters
    if (this.filtroCuartos) params.cuartos = this.filtroCuartos;
    if (this.filtroBanos) params.banos = this.filtroBanos;
    if (this.filtroSalas) params.salas = this.filtroSalas;
    if (this.filtroMetrosMin) params.metros_min = this.filtroMetrosMin;
    if (this.filtroMetrosMax) params.metros_max = this.filtroMetrosMax;
    if (this.filtroZona) params.zona = this.filtroZona;
    if (this.filtroAmueblado) params.amueblado = this.filtroAmueblado;
    if (this.filtroServicios) params.servicios_basicos = this.filtroServicios;
    
    let headers = new HttpHeaders();
    const user = this.authService.currentUser();
    if (user && user.id_tenant) {
        headers = headers.set('X-Tenant-ID', user.id_tenant.toString());
    }

    this.http.get<any[]>('http://localhost:8000/modulo_inmuebles/propiedades/catalogo', { params, headers })
      .subscribe({
        next: (res: any[]) => {
          this.propiedades = [...res];
          console.log('Propiedades cargadas:', this.propiedades.length);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando propiedades:', err);
          this.cdr.detectChanges();
        }
      });
  }
}
