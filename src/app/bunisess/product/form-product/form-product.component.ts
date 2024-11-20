import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrl: './form-product.component.scss'
})
export class FormProductComponent implements OnInit {
  productForm: FormGroup = new FormGroup({});
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<any>,
    private fb: FormBuilder,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initProductForm();
    console.log('Data :', this.data);
  }

  onlyLettersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const valid = /^[a-zA-Z\s]*$/.test(value);
      return valid ? null : { onlyLetters: true };
    };
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.confirmUpdateProduct();
    } else {
      this.registerProduct();
    }
  }

  registerProduct() {
    this.productService.crearProduct(this.productForm.value).subscribe((res) => {
      console.log('Respuesta registrar cliente:', res);
      this.showSuccessMessage();
      this.cancelar(true);
    });
  }

  confirmUpdateProduct() {
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
        this.updateProduct();
      }
    });
  }

  updateProduct() {
    this.productService.actualizarProduct(this.data.id, this.productForm.value).subscribe((res) => {
      console.log('Respuesta registrar producto:', res);
      this.showSuccessMessageUpdate();
      this.cancelar(true);
    });
  }

  initProductForm() {
    this.productForm = this.fb.group({
      series: ['', [Validators.required]],
      names: ['', [Validators.required, this.onlyLettersValidator()]],
      description: ['', [Validators.required, this.onlyLettersValidator()]],
      category: ['', [Validators.required]],
      purchaseDate: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      stock: ['', [Validators.required]],
    });

    if (this.data) {
      this.productForm.patchValue({
        series: this.data.series,
        names: this.data.names,
        description: this.data.description,
        category: this.data.category,
        purchaseDate: this.data.purchaseDate,
        price: this.data.price,
        stock: this.data.stock
      });
    }
  }

  get form() {
    return this.productForm.controls;
  }

  cancelar(success?: boolean) {
    this.dialogRef.close(success);
  }

  showSuccessMessage() {
    Swal.fire({
      icon: 'success',
      title: 'Registro añadido exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }

  showSuccessMessageUpdate() {
    Swal.fire({
      icon: 'success',
      title: 'Registro actualizado exitosamente',
      showConfirmButton: false,
      timer: 1500
    });
  }
}
