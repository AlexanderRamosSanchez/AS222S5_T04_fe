import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormSaleComponent } from './form-sale/form-sale.component';
import { SaleService } from '../../core/services/sale.service';
import { ProductService } from '../../core/services/product.service';
import { ClientService } from '../../core/services/client.service';
import Swal from 'sweetalert2';

export interface SaleData {
  id: string;
  saleDate: string;
  salesType: string;
  fullName: string;
  payment: string;
  totalAmount: number;
  saleDetails: SaleDetail[];
}

export interface SaleDetail {
  productName: string;
  amount: number;
  price: number;
}

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.scss'
})

export class SaleComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'saleDate', 'fullName', 'sellerName', 'salesType', 'payment', 'totalAmount', 'action'];
  public dataSource: MatTableDataSource<SaleData> = new MatTableDataSource<SaleData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private saleService: SaleService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarSale();
  }

  downloadPDF() {
    const pdfUrl = 'https://ideal-goggles-jx54jvpxvpjc5r59-8080.app.github.dev/api/sales/reportSale';
    window.open(pdfUrl, '_blank');
  }

  listarSale() {
    const listFunction = this.showButton ? this.saleService.listarSaleInac() : this.saleService.listarSale();
    listFunction.subscribe(
      (res: any) => {
        const transformedData: SaleData[] = res.map((sale: any) => {
          const saleDetails: SaleDetail[] = sale.saleDetails.map((detail: any) => ({
            productName: detail.product.names,
            amount: detail.amount,
            price: detail.price
          }));
          
          const totalAmount = saleDetails.reduce((acc, detail) => acc + ( detail.price), 0);
          
          return {
            id: sale.id,
            saleDate: sale.saleDate,
            salesType: sale.salesType,
            fullName: `${sale.client.names} ${sale.client.lastNames}`.trim(),
            sellerName: `${sale.seller.names} ${sale.seller.lastNames}`.trim(),
            payment: sale.payment,
            totalAmount: totalAmount,
            saleDetails: saleDetails
          };
        });
        this.dataSource.data = transformedData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al listar las ventas:', error);
      }
    );
  }  

  toggleEstadoSale() {
    this.showButton = !this.showButton;
    this.listarSale();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(sale?: SaleData) {
    const dlgRef = this.dialog.open(FormSaleComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '700px',
      data: sale
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerró el diálogo con el valor:', res);
      if (res) {
        this.listarSale();
      }
    });
  }

  activar(saleId: number) {
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
        this.saleService.activarSale(saleId).subscribe(
          () => {
            console.log('Cliente activado correctamente');
            this.listarSale();
          },
          error => {
            console.error('Error al activar al cliente:', error);
          }
        );
      }
    });
  }


  eliminarSale(saleId: number) {
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
        this.saleService.eliminarSale(saleId).subscribe(
          () => {
            console.log('Cliente eliminado correctamente');
            this.listarSale();
          },
          error => {
            console.error('Error al eliminar el cliente:', error);
          }
        );
      }
    });
  }
}