import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotsComponent } from './chatBots.component';

describe('PurchaseComponent', () => {
  let component: ChatBotsComponent;
  let fixture: ComponentFixture<ChatBotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatBotsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatBotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
