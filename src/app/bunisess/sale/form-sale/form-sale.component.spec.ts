import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSaleComponent } from './form-sale.component';

describe('FormSaleComponent', () => {
  let component: FormSaleComponent;
  let fixture: ComponentFixture<FormSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormSaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
