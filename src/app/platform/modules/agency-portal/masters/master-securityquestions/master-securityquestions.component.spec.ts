import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSecurityquestionsComponent } from './master-securityquestions.component';

describe('MasterSecurityquestionsComponent', () => {
  let component: MasterSecurityquestionsComponent;
  let fixture: ComponentFixture<MasterSecurityquestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSecurityquestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSecurityquestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
