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

  constructor(private router: Router) {
    const roleStr = localStorage.getItem('user_role');
    this.userRole = roleStr ? parseInt(roleStr, 10) : 0;
  }

  logout() {
    // CU-02: Cerrar sesión (limpiar token y redirigir)
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
