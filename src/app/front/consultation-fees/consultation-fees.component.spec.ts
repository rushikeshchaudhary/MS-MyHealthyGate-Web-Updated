import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationFeesComponent } from './consultation-fees.component';

describe('ConsultationFeesComponent', () => {
  let component: ConsultationFeesComponent;
  let fixture: ComponentFixture<ConsultationFeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationFeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
