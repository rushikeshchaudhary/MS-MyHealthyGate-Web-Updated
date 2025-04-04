import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientdocumentsComponent } from './clientdocuments.component';

describe('ClientdocumentsComponent', () => {
  let component: ClientdocumentsComponent;
  let fixture: ComponentFixture<ClientdocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientdocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientdocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
