import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html'
})
export class App implements OnInit {
  title = 'Dashboard Ventas';
  reporteVentas = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerReporte();
  }

  obtenerReporte(): void {
    this.http.get<any[]>('http://localhost:3000/api/reporte-ventas')
      .subscribe({
        next: (data) => this.reporteVentas.set(data),
        error: (err) => console.error('Error de conexión con la DB:', err)
      });
  }
}
