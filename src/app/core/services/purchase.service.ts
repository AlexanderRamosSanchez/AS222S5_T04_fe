import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(private http: HttpClient) { }

  listarPurchase() {
    return this.http.get(`${environment.apiUrl}/api/purchase`);
  }

  listarPurchaseInac() {
    return this.http.get(`${environment.apiUrl}/api/purchase/purchaseInac`);
  }

  registrarPurchase(datosPurchase: any) {
    return this.http.post(`${environment.apiUrl}/api/purchase/crear`, datosPurchase);
  }

  actualizarPurchase(id: number, datosPurchase: any) {
    return this.http.put(`${environment.apiUrl}/api/purchase/actualizar/${id}`, datosPurchase);
  }

  eliminarPurchase(purchaseId: number) {
    return this.http.delete(`${environment.apiUrl}/api/purchase/delete/${purchaseId}`);
  }

  activarPurchase(purchaseId: number) {
    return this.http.put(`${environment.apiUrl}/api/purchase/active/${purchaseId}`, {});
  }
}
