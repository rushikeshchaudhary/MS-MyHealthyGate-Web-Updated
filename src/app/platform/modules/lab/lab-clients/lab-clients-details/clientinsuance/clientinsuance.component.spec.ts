import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientinsuanceComponent } from './clientinsuance.component';

describe('ClientinsuanceComponent', () => {
  let component: ClientinsuanceComponent;
  let fixture: ComponentFixture<ClientinsuanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientinsuanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientinsuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
