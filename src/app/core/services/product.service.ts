import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  //Api para la seccion de productos
  listarProduct() {
    return this.http.get(`${environment.apiUrl}/api/products/productAc`);
  }

  listarProductInactivos() {
    return this.http.get(`${environment.apiUrl}/api/products/productIn`);
  }

  eliminarProduct(productId: number) {
    return this.http.delete(`${environment.apiUrl}/api/products/delete/${productId}`);
  }

  activarProduct(productId: number) {
    return this.http.put(`${environment.apiUrl}/api/products/active/${productId}`, {});
  }

  crearProduct(datosProduct: any) {
    return this.http.post(`${environment.apiUrl}/api/products/crear`, datosProduct);
  }

  actualizarProduct(id: number, datosProduct: any) {
    return this.http.put(`${environment.apiUrl}/api/products/${id}`, datosProduct);
  }
}
