import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormProductComponent } from './form-product/form-product.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../../core/services/product.service';

export interface UserData {
  id: string;
  purchaseDate: string;
  series: string;
  names: string;
  description: string;
  price: string;
  stock: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  public displayedColumns: string[] = ['purchaseDate', 'series', 'names', 'description', 'price', 'stock', 'action'];
  public dataSource: MatTableDataSource<UserData> = new MatTableDataSource<UserData>([]);
  public showButton: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.listarProduct();
  }

  listarProduct() {
    const listFunction = this.showButton ? this.productService.listarProductInactivos() : this.productService.listarProduct();
    listFunction.subscribe(
      (res: any) => {
        this.dataSource.data = res as UserData[];
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error al listar productos:', error);
      }
    );
  }

  toggleEstadoProducto() {
    this.showButton = !this.showButton;
    this.listarProduct();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(product?: any) {
    const dlgRef = this.dialog.open(FormProductComponent, {
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: false,
      position: { top: '30px' },
      width: '500px',
      data: product
    });
    dlgRef.afterClosed().subscribe(res => {
      console.log('Se cerro el dialog con el valor:', res);
      if (res) {
        this.listarProduct();
      }
    });
  }

  activar(productId: number) {
    this.productService.activarProduct(productId).subscribe(
      () => {
        console.log('Producto activado correctamente');
        this.listarProduct();
      },
      error => {
        console.error('Error al activar el producto:', error);
      }
    );
  }

  eliminarProducto(productId: number) {
    this.productService.eliminarProduct(productId).subscribe(
      () => {
        console.log('Producto eliminado correctamente');
        this.listarProduct();
      },
      error => {
        console.error('Error al eliminar el producto:', error);
      }
    );
  }
}
