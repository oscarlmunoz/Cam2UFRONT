import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderManagerComponent } from './custom-order-manager.component';

describe('CustomOrderManagerComponent', () => {
  let component: CustomOrderManagerComponent;
  let fixture: ComponentFixture<CustomOrderManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomOrderManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomOrderManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
