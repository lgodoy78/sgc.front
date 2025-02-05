import { Component, signal, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ThemeService } from 'src/app/core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export default class DashboardComponent {
  // Estado del sidebar (mobile)
  isSidebarOpen = signal(true);
  _themeService: any;
  // Datos de ejemplo
  stats = signal([
    { title: 'Ventas totales', value: '$24,500', trend: '↑ 12%' },
    { title: 'Usuarios activos', value: '1,230', trend: '↑ 5%' },
    { title: 'Tareas completadas', value: '89/120', trend: '↓ 3%' }
  ]);
 
  activities = signal<any[]>([]);
  isLoading = signal(true);

  constructor(private themeService: ThemeService) {
   this._themeService = themeService;

  }

  ngOnInit() {
    //this.loadData();
  }

  /*loadData() {
    this.dataService.getDashboardStats().subscribe({
      next: (data) => this.stats.set(data),
      error: (err) => console.error('Error loading stats:', err)
    });

    this.dataService.getRecentActivities().subscribe({
      next: (data) => {
        this.activities.set(data);
        this.isLoading.set(false);
      },
      error: (err) => console.error('Error loading activities:', err)
    });
  }*/
}  