import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property.service';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyCatalogItem, PropertyFilterParams } from '../../../core/models/property.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-catalogo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="infocasas-landing">
      <!-- Top Navigation Bar -->
      <header class="navbar-public">
        <div class="nav-container">
          <div class="logo">
            <svg class="logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M3 21h18M3 10l9-7 9 7v11H3V10z"/>
              <path d="M9 21v-6h6v6"/>
            </svg>
            <span class="logo-text">Inmobiliaria Raíces</span>
          </div>

          <div class="nav-links">
            <a (click)="setTab('')" [class.active]="activeTab === ''">Todas</a>
            <a (click)="setTab('Venta')" [class.active]="activeTab === 'Venta'">Venta</a>
            <a (click)="setTab('Alquiler')" [class.active]="activeTab === 'Alquiler'">Alquiler</a>
            <a (click)="setTab('Anticretico')" [class.active]="activeTab === 'Anticretico'">Anticrético</a>
          </div>

          <div class="nav-actions">
            <a *ngIf="!isLoggedIn" routerLink="/login" class="btn btn-outline">Iniciar Sesión</a>
            <a *ngIf="!isLoggedIn" routerLink="/register" class="btn btn-primary">Registrarse</a>
            <a *ngIf="isLoggedIn" routerLink="/dashboard" class="btn btn-primary">Ir al Dashboard</a>
          </div>
        </div>
      </header>

      <!-- InfoCasas Hero Search Section -->
      <section class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1 class="hero-title">Encuentra la propiedad de tus sueños en Bolivia</h1>
          <p class="hero-subtitle">Casas, departamentos, oficinas y terrenos disponibles de las mejores inmobiliarias SaaS</p>

          <!-- InfoCasas Search Box Card -->
          <div class="search-box-card">
            <!-- Tabs Bar -->
            <div class="tabs-bar">
              <button 
                type="button" 
                class="tab-btn" 
                [class.active]="activeTab === ''" 
                (click)="setTab('')">
                Todas las Operaciones
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                [class.active]="activeTab === 'Venta'" 
                (click)="setTab('Venta')">
                Comprar
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                [class.active]="activeTab === 'Alquiler'" 
                (click)="setTab('Alquiler')">
                Alquilar
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                [class.active]="activeTab === 'Anticretico'" 
                (click)="setTab('Anticretico')">
                Anticrético
              </button>
            </div>

            <!-- Search Form Filters -->
            <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="search-form">
              <div class="search-grid">
                <div class="form-group flex-2">
                  <label>Ubicación / Zona</label>
                  <input type="text" formControlName="zona" placeholder="Ej: Urubó, Equipetrol, Las Palmas...">
                </div>

                <div class="form-group">
                  <label>Empresa Inmobiliaria</label>
                  <select formControlName="tenant_id">
                    <option [ngValue]="null">Todas las Inmobiliarias</option>
                    <option [ngValue]="1">Raíces Inmobiliaria</option>
                    <option [ngValue]="2">Horizonte Bienes Raíces</option>
                    <option [ngValue]="3">Cúspide Propiedades</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Precio Máximo ($)</label>
                  <input type="number" formControlName="precio_max" placeholder="Sin límite">
                </div>

                <div class="form-group btn-container">
                  <button type="submit" class="btn btn-primary btn-search">
                    <svg class="search-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    Buscar
                  </button>
                </div>
              </div>

              <!-- Secondary Advanced Filters Toggle -->
              <div class="advanced-filters-row">
                <div class="filter-item">
                  <label>Cuartos mín:</label>
                  <input type="number" formControlName="cuartos" placeholder="0">
                </div>
                <div class="filter-item">
                  <label>Baños mín:</label>
                  <input type="number" formControlName="banos" placeholder="0">
                </div>
                <div class="filter-item check">
                  <label><input type="checkbox" formControlName="amueblado"> Amueblado</label>
                </div>
                <div class="filter-item check">
                  <label><input type="checkbox" formControlName="servicios_basicos"> Servicios Básicos</label>
                </div>
                <button type="button" class="reset-link" (click)="resetFilters()">Limpiar Filtros</button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <!-- Main Property Listings Section -->
      <section class="main-container">
        <div class="section-header">
          <div>
            <h2>Propiedades Destacadas</h2>
            <p class="section-sub">Inmuebles verificados disponibles para entrega inmediata</p>
          </div>
          <span class="count-badge" *ngIf="!loading">{{ propiedades.length }} Propiedades registradas</span>
        </div>

        <!-- Loading State -->
        <div class="loading-box" *ngIf="loading">
          <div class="spinner spinner-dark"></div>
          <p>Cargando el catálogo de inmuebles...</p>
        </div>

        <!-- Empty State -->
        <div class="empty-box" *ngIf="!loading && propiedades.length === 0">
          <svg class="empty-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
          <h3>No se encontraron inmuebles con los criterios seleccionados</h3>
          <p>Prueba ajustando los filtros de búsqueda o seleccionando otra ubicación.</p>
        </div>

        <!-- Cards Grid -->
        <div class="properties-grid" *ngIf="!loading && propiedades.length > 0">
          <div class="property-card" *ngFor="let prop of propiedades">
            <div class="card-image-box">
              <img 
                [src]="prop.imagenes.length > 0 ? prop.imagenes[0].url : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'" 
                [alt]="prop.titulo"
                (error)="onImageError($event)">
              <span class="op-badge" [ngClass]="prop.tipo_operacion.toLowerCase()">{{ prop.tipo_operacion }}</span>
              <span class="tenant-tag">Empresa #{{ prop.id_empresa }}</span>
            </div>

            <div class="card-content">
              <div class="price">$ {{ prop.precio | number:'1.2-2' }}</div>
              <h3 class="title">{{ prop.titulo }}</h3>
              <p class="address">
                <svg class="pin-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ prop.direccion }}
              </p>

              <div class="features-list">
                <span class="feature-tag" *ngFor="let feat of prop.caracteristicas">
                  <strong>{{ feat.nombre }}:</strong> {{ feat.valor }}
                </span>
              </div>
            </div>

            <div class="card-footer">
              <button class="btn btn-outline btn-sm" (click)="openDetailModal(prop)">Ver Detalles</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Detail Modal -->
      <div class="modal-backdrop" *ngIf="selectedProp" (click)="closeDetailModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ selectedProp.titulo }}</h3>
            <button class="close-btn" (click)="closeDetailModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="modal-price">$ {{ selectedProp.precio | number:'1.2-2' }} — <span class="op-type">{{ selectedProp.tipo_operacion }}</span></div>
            <p class="modal-address">
              <svg class="pin-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ selectedProp.direccion }}
            </p>
            
            <h4 class="feat-heading">Características Principales:</h4>
            <div class="modal-features">
              <div class="feature-item" *ngFor="let feat of selectedProp.caracteristicas">
                <span class="feat-name">{{ feat.nombre }}:</span>
                <span class="feat-val">{{ feat.valor }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeDetailModal()">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .infocasas-landing { min-height: 100vh; background-color: #f8fafc; font-family: var(--font-sans); }
    .navbar-public {
      background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 14px 0;
      position: sticky; top: 0; z-index: 100; box-shadow: var(--shadow-sm);
    }
    .nav-container {
      max-width: 1200px; margin: 0 auto; padding: 0 24px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .logo { display: flex; align-items: center; gap: 10px; }
    .logo-svg { width: 26px; height: 26px; stroke: #2563eb; }
    .logo-text { font-size: 18px; font-weight: 800; color: #0f172a; }
    .nav-links {
      display: flex; gap: 24px;
      a {
        font-size: 14px; font-weight: 600; color: #475569; cursor: pointer;
        padding-bottom: 4px; border-bottom: 2px solid transparent;
        &:hover, &.active { color: #2563eb; border-bottom-color: #2563eb; }
      }
      @media (max-width: 768px) { display: none; }
    }
    .nav-actions { display: flex; gap: 12px; }
    
    /* InfoCasas Hero Section */
    .hero-section {
      position: relative;
      background-image: url('https://images.trvl-media.com/place/6053940/8eff4d6f-0c40-4ab8-8f6f-b073cc580304.jpg');
      background-size: cover;
      background-position: center;
      padding: 60px 24px 80px 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .hero-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.85) 100%);
    }
    .hero-content {
      position: relative; z-index: 10; max-width: 1000px; width: 100%; text-align: center; color: white;
    }
    .hero-title { font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 8px; }
    .hero-subtitle { font-size: 15px; color: #e2e8f0; margin-bottom: 32px; font-weight: 400; }
    
    /* Search Box Card */
    .search-box-card {
      background: #ffffff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      text-align: left;
      color: #1e293b;
    }
    .tabs-bar {
      display: flex; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px;
    }
    .tab-btn {
      padding: 8px 18px; border-radius: 8px; border: none; background: #f1f5f9;
      color: #475569; font-weight: 600; font-size: 13.5px; cursor: pointer; transition: all 0.2s;
      &:hover { background: #e2e8f0; }
      &.active { background: #2563eb; color: #ffffff; }
    }
    .search-grid {
      display: grid; grid-template-columns: 2fr 1fr 1fr 140px; gap: 14px; align-items: flex-end;
      @media (max-width: 900px) { grid-template-columns: 1fr; }
    }
    .btn-search {
      width: 100%; height: 42px; display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .search-svg { width: 16px; height: 16px; }
    .advanced-filters-row {
      display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 16px; padding-top: 16px;
      border-top: 1px dashed #e2e8f0; font-size: 13px;
    }
    .filter-item {
      display: flex; align-items: center; gap: 6px;
      input[type="number"] { width: 70px; padding: 4px 8px; font-size: 13px; }
      &.check label { cursor: pointer; font-weight: 500; }
    }
    .reset-link {
      margin-left: auto; background: none; border: none; color: #2563eb; cursor: pointer; font-size: 12.5px; font-weight: 600;
      &:hover { text-decoration: underline; }
    }

    /* Property Grid */
    .main-container { max-width: 1200px; margin: 40px auto; padding: 0 24px; }
    .section-header {
      display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px;
      h2 { font-size: 22px; color: #0f172a; }
      .section-sub { font-size: 13px; color: #64748b; margin-top: 2px; }
      .count-badge { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 99px; font-weight: 600; font-size: 12px; }
    }
    .properties-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;
    }
    .property-card {
      background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;
      display: flex; flex-direction: column; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
      &:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    }
    .card-image-box { position: relative; height: 190px; background: #e2e8f0; }
    .card-image-box img { width: 100%; height: 100%; object-fit: cover; }
    .op-badge {
      position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 6px;
      font-weight: 700; font-size: 11px; color: white; text-transform: uppercase;
      &.venta { background: #10b981; }
      &.alquiler { background: #2563eb; }
      &.anticretico { background: #d97706; }
    }
    .tenant-tag {
      position: absolute; bottom: 8px; right: 8px; background: rgba(15, 23, 42, 0.75);
      color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px;
    }
    .card-content { padding: 16px; flex: 1; }
    .price { font-size: 20px; font-weight: 800; color: #1e3a8a; }
    .title { font-size: 15px; font-weight: 700; color: #0f172a; margin: 4px 0; }
    .address { font-size: 12.5px; color: #64748b; margin-bottom: 12px; display: flex; align-items: center; gap: 4px; }
    .pin-svg { width: 14px; height: 14px; stroke: #64748b; flex-shrink: 0; }
    .features-list { display: flex; flex-wrap: wrap; gap: 6px; }
    .feature-tag { background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 11px; color: #475569; }
    .card-footer { padding: 12px 16px; background: #fafafa; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
    .loading-box, .empty-box { background: #ffffff; padding: 60px; text-align: center; border-radius: 12px; border: 1px solid #e2e8f0; }
    .empty-svg { width: 48px; height: 48px; stroke: #94a3b8; margin-bottom: 12px; }
    
    /* Modal */
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6);
      display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;
    }
    .modal-card {
      background: #ffffff; border-radius: 16px; width: 100%; max-width: 500px; padding: 24px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2);
    }
    .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #64748b; }
    .modal-body { padding: 20px 0; }
    .modal-price { font-size: 22px; font-weight: 800; color: #1e3a8a; }
    .modal-address { font-size: 13px; color: #64748b; margin-bottom: 16px; display: flex; align-items: center; gap: 4px; }
    .feat-heading { font-size: 14px; margin-bottom: 10px; color: #0f172a; }
    .modal-features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .feature-item { background: #f8fafc; padding: 8px 12px; border-radius: 6px; font-size: 13px; }
    .modal-footer { display: flex; justify-content: flex-end; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  `]
})
export class CatalogoListComponent implements OnInit {
  filterForm: FormGroup;
  propiedades: PropertyCatalogItem[] = [];
  loading = false;
  isLoggedIn = false;
  selectedProp: PropertyCatalogItem | null = null;
  activeTab = '';

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.filterForm = this.fb.group({
      tipo_operacion: [''],
      tenant_id: [null],
      precio_min: [null],
      precio_max: [null],
      cuartos: [null],
      banos: [null],
      salas: [null],
      zona: [''],
      amueblado: [null],
      servicios_basicos: [null]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.applyFilters();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.filterForm.patchValue({ tipo_operacion: tab });
    this.applyFilters();
  }

  applyFilters(): void {
    this.loading = true;
    const formVals = this.filterForm.value;
    
    const filters: PropertyFilterParams = {
      tipo_operacion: formVals.tipo_operacion || undefined,
      precio_min: formVals.precio_min ?? undefined,
      precio_max: formVals.precio_max ?? undefined,
      cuartos: formVals.cuartos ?? undefined,
      banos: formVals.banos ?? undefined,
      salas: formVals.salas ?? undefined,
      zona: formVals.zona || undefined,
      amueblado: formVals.amueblado ?? undefined,
      servicios_basicos: formVals.servicios_basicos ?? undefined
    };

    const tenantId = formVals.tenant_id ?? undefined;

    this.propertyService.getCatalogo(filters, tenantId).subscribe({
      next: (data) => {
        this.propiedades = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notificationService.error('Error al obtener el catálogo de propiedades.');
      }
    });
  }

  resetFilters(): void {
    this.activeTab = '';
    this.filterForm.reset({
      tipo_operacion: '',
      tenant_id: null,
      precio_min: null,
      precio_max: null,
      cuartos: null,
      banos: null,
      salas: null,
      zona: '',
      amueblado: null,
      servicios_basicos: null
    });
    this.applyFilters();
  }

  onImageError(event: any): void {
    event.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&auto=format&fit=crop&q=60';
  }

  openDetailModal(prop: PropertyCatalogItem): void {
    this.selectedProp = prop;
  }

  closeDetailModal(): void {
    this.selectedProp = null;
  }
}
