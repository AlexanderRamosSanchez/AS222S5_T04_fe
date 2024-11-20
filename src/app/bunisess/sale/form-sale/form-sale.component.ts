import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { SaleService } from '../../../core/services/sale.service';
import { ClientService } from '../../../core/services/client.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-sale',
  templateUrl: './form-sale.component.html',
  styleUrls: ['./form-sale.component.scss']
})
export class FormSaleComponent implements OnInit {

  saleForm: FormGroup = new FormGroup({});
  personas: any[] = [];
  vendedores: any[] = [];
  productos: any[] = [];
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<FormSaleComponent>,
    private fb: FormBuilder,
    private saleService: SaleService,
    private clientService: ClientService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.saleForm = this.fb.group({
      clientId: ['', Validators.required],
      sellerId: ['', Validators.required],
      salesType: ['', Validators.required],
      payment: ['', Validators.required],
      saleDetails: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getPersonas();
    this.getVendedores();
    this.getProductos();
  }

  getPersonas(): void {
    this.clientService.listarClient().subscribe((res: any) => {
      console.log('Respuesta listarClient:', res);
      this.personas = res;
      if (this.data) {
        this.initSaleForm();
      }
    }, error => {
      console.error('Error al obtener personas:', error);
    });
  }

  getVendedores(): void {
    this.clientService.listarSeller().subscribe((res: any) => {
      console.log('Respuesta listarSeller:', res);
      this.vendedores = res;
      if (this.data) {
        this.initSaleForm();
      }
    }, error => {
      console.error('Error al obtener personas:', error);
    });
  }

  getProductos(): void {
    this.productService.listarProduct().subscribe((res: any) => {
      console.log('Respuesta listarProduct:', res);
      this.productos = res;
      if (this.data) {
        this.initSaleForm();
      }
    }, error => {
      console.error('Error al obtener productos:', error);
    });
  }

  initSaleForm(): void {
    const client = this.personas.find(s => `${s.names} ${s.lastNames}`.trim() === this.data.fullName);
    const clientId = client ? client.id : null;
  
    const seller = this.vendedores.find(s => `${s.names} ${s.lastNames}`.trim() === this.data.sellerName);
    const sellerId = seller ? seller.id : null;
  
    this.saleForm.patchValue({
      clientId: clientId,
      sellerId: sellerId,
      salesType: this.data.salesType,
      payment: this.data.payment
    });
  
    while (this.saleDetails.length !== 0) {
      this.saleDetails.removeAt(0);
    }
  
    this.data.saleDetails.forEach((detail: any) => {
      const product = this.productos.find(p => p.names === detail.productName);
      const productId = product ? product.id : null;
      this.addSaleDetail({ productId: productId, amount: detail.amount });
    });
  }
  

  get saleDetails(): FormArray {
    return this.saleForm.get('saleDetails') as FormArray;
  }

  addSaleDetail(detail?: any): void {
    this.saleDetails.push(this.fb.group({
      productId: [detail ? detail.productId : '', Validators.required],
      amount: [detail ? detail.amount : '', Validators.required]
    }));
  }

  removeSaleDetail(index: number): void {
    this.saleDetails.removeAt(index);
  }

  updatePrice(index: number): void {
    const saleDetailGroup = this.saleDetails.at(index) as FormGroup;
    const productId = saleDetailGroup.get('productId')?.value;
    const amount = saleDetailGroup.get('amount')?.value;

    if (productId && amount) {
      const product = this.productos.find(p => p.id === productId);
      if (product) {
        const price = product.price * amount;
        saleDetailGroup.get('price')?.setValue(price);
      }
    }
  }

  getPrice(index: number): number {
    const saleDetailGroup = this.saleDetails.at(index) as FormGroup;
    const productId = saleDetailGroup.get('productId')?.value;
    const amount = saleDetailGroup.get('amount')?.value;

    if (productId && amount) {
      const product = this.productos.find(p => p.id === productId);
      if (product) {
        return product.price * amount;
      }
    }
    return 0;
  }

  saveSale(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    const saleData = this.prepareSaleData();
    if (this.data) {
      this.confirmUpdateSale(saleData);
    } else {
      this.registerSale(saleData);
    }
  }

  prepareSaleData(): any {
    const formValue = this.saleForm.value;
    const saleDetails = formValue.saleDetails.map((detail: any) => {
      return {
        productId: detail.productId,
        amount: detail.amount
      };
    });

    return {
      ...formValue,
      saleDetails: saleDetails
    };
  }

  registerSale(saleData: any): void {
    this.saleService.registrarSale(saleData).subscribe((res) => {
      console.log('Respuesta registrar venta:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    });
  }

  confirmUpdateSale(saleData: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateSale(saleData);
      }
    });
  }

  updateSale(saleData: any): void {
    this.saleService.actualizarVenta(this.data.id, saleData).subscribe((res) => {
      console.log('Respuesta actualizar venta:', res);
      this.showSuccessMessageUpdate();
      this.cancelar(true);
    }, error => {
      console.error('Error al actualizar la venta:', error);
    });
  }

  cancelar(success?: boolean): void {
    this.dialogRef.close(success);
  }

  showSuccessMessage(): void {
    Swal.fire({
      icon: 'success',
      title: 'Venta registrada exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }

  showSuccessMessageUpdate(): void {
    Swal.fire({
      icon: 'success',
      title: 'Venta actualizada exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
