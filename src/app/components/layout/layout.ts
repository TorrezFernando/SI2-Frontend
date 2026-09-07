import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
  userRole: number = 0;
  tenantNombre: string = 'Premium';
  rolNombre: string = '';

  constructor(private router: Router) {
    const roleStr = localStorage.getItem('user_role');
    this.userRole = roleStr ? parseInt(roleStr, 10) : 0;
    
    switch (this.userRole) {
      case 1: this.rolNombre = 'Administrador'; break;
      case 2: this.rolNombre = 'Agente'; break;
      case 3: this.rolNombre = 'Cliente'; break;
      case 4: this.rolNombre = 'Propietario'; break;
      default: this.rolNombre = 'Usuario';
    }
  }

  logout() {
    // CU-02: Cerrar sesión (limpiar token y redirigir)
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }
}
