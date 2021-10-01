import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoFormPublicComponent } from './pedido-form-public.component';

describe('PedidoFormPublicComponent', () => {
  let component: PedidoFormPublicComponent;
  let fixture: ComponentFixture<PedidoFormPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidoFormPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoFormPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
