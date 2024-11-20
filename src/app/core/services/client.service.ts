import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  listarClient() {
    return this.http.get(`${environment.apiUrl}/api/persons/clients`);
  }

  listarSeller() {
    return this.http.get(`${environment.apiUrl}/api/persons/seller`);
  }

  listarClientInactivos() {
    return this.http.get(`${environment.apiUrl}/api/persons/clientsInac`);
  }

  eliminarClient(clientId: number) {
    return this.http.delete(`${environment.apiUrl}/api/persons/delete/${clientId}`);
  }

  activarClient(clientId: number) {
    return this.http.put(`${environment.apiUrl}/api/persons/active/${clientId}`, {});
  }

  crearPerson(datosPersona: any) {
    return this.http.post(`${environment.apiUrl}/api/persons/crearClient`, datosPersona);
  }

  actualizarPersona(id: number, datosPersona: any) {
    return this.http.put(`${environment.apiUrl}/api/persons/${id}`, datosPersona);
  }

  //Api para el proveedor
  listarSupplier() {
    return this.http.get(`${environment.apiUrl}/api/suppliers/suppliersAc`);
  }

}
