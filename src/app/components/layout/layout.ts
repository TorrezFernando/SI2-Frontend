import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, HasPermissionDirective],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout implements OnDestroy {
  suscripcion: any = null;
  private avisoTimer: ReturnType<typeof setInterval> | null = null;
  private cargarSuscripcion() {
    this.http.get('http://localhost:8000/suscripciones/mi-estado', {headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))}).subscribe({
      next: data => {this.suscripcion = data; this.cdr.detectChanges();},
      error: () => {}
    });
  }
  ngOnDestroy() { if (this.avisoTimer) clearInterval(this.avisoTimer); }

  get isSuperAdmin(): boolean { return JSON.parse(localStorage.getItem('user') || '{}').is_superadmin === true; }
  userRole: number = 0;
  rolNombre: string = 'Inmobiliaria';
  tenantNombre: string = '';
  showHelp: boolean = false;

  constructor(private router: Router, private authService: AuthService, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.cargarSuscripcion();
    this.avisoTimer = setInterval(() => this.cargarSuscripcion(), 60000);
    const userRole = localStorage.getItem('user_role');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = userRole ? parseInt(userRole, 10) : 0;
    
    switch (this.userRole) {
      case 1: 
        this.rolNombre = 'Administrador'; 
        break;
      default:
        // El rol ya no controla los menús, pero podemos mostrar el nombre
        if (userRole) {
            const roles: Record<number, string> = {1: 'Admin', 2: 'Agente', 3: 'Propietario', 4: 'Cliente'};
            this.rolNombre = user.nombre || 'Perfil';
        }
        break;
    }
  }

  toggleHelp() {
    this.showHelp = !this.showHelp;
  }

  logout() {
    this.authService.logout();
  }
}
