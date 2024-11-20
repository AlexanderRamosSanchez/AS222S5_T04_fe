import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormPersonComponent } from './form-person/form-person.component';
import { ClientService } from '../../core/services/client.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export interface UserData {
  id: string;
  typeDocument: string;
  numberDocument: string;
  names: string;
  lastNames: string;
  birthdayDate: string;
  typePerson: string;
  cellPhone: string;
  email: string;
  active: boolean;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit{

  public displayedColumns: string[] = ['typeDocument', 'numberDocument', 'names', 'lastNames', 'birthdayDate', 'typePerson', 'cellPhone', 'email', 'action'];
  public dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarClient();
  }

  listarClient() {
    const listFunction = this.showButton ? this.clientService.listarClientInactivos() : this.clientService.listarClient();
    listFunction.subscribe(
      (res: any) => {
        this.dataSource.data = res as UserData[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al listar clientes:', error);
      }
    );
  }

  downloadPDF() {
    const pdfUrl = this.showButton 
      ? 'https://ideal-goggles-jx54jvpxvpjc5r59-8080.app.github.dev/api/persons/reportInac'
      : 'https://ideal-goggles-jx54jvpxvpjc5r59-8080.app.github.dev/api/persons/report';
    window.open(pdfUrl, '_blank');
  }

  downloadXLS() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

    // Guardar el archivo XLSX
    const wbout: Blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(wbout);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.showButton ? 'clientes_inactivos.xlsx' : 'clientes_activos.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  downloadCSV() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const csvData: string = XLSX.utils.sheet_to_csv(ws);

    // Crear el archivo CSV
    const blob: Blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.showButton ? 'clientes_inactivos.csv' : 'clientes_activos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  toggleEstadoClientes() {
    this.showButton = !this.showButton;
    this.listarClient();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(person?: any) {
    const dlgRef = this.dialog.open(FormPersonComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      data: person
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerro el dialog con el valor:', res);
      if (res) {
        this.listarClient();
      }
    })
  }

  confirmarEliminarCliente(clientId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCliente(clientId);
      }
    });
  }

  activar(clientId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a restaurar este cliente.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, restaurar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.activarClient(clientId).subscribe(
          () => {
            console.log('Cliente activado correctamente');
            this.listarClient();
          },
          error => {
            console.error('Error al activar al cliente:', error);
          }
        );
      }
    });
  }


  eliminarCliente(clientId: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.eliminarClient(clientId).subscribe(
          () => {
            console.log('Cliente eliminado correctamente');
            this.listarClient();
          },
          error => {
            console.error('Error al eliminar el cliente:', error);
          }
        );
      }
    });
  }
}
