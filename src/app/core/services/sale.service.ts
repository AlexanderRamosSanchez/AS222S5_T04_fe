import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  listarSale() {
    return this.http.get(`${environment.apiUrl}/api/sales`);
  } 

  listarSaleInac() {
    return this.http.get(`${environment.apiUrl}/api/sales/saleInac`);
  }

  registrarSale(datosSale: any) {
    return this.http.post(`${environment.apiUrl}/api/sales/crear`, datosSale);
  }

  actualizarVenta(id: number, datosSale: any) {
    return this.http.put(`${environment.apiUrl}/api/sales/actualizar/${id}`, datosSale);
  }

  eliminarSale(saleId: number) {
    return this.http.delete(`${environment.apiUrl}/api/sales/delete/${saleId}`);
  }

  activarSale(saleId: number) {
    return this.http.put(`${environment.apiUrl}/api/sales/active/${saleId}`, {});
  }
}
