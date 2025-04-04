import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabclientheaderComponent } from './labclientheader.component';

describe('LabclientheaderComponent', () => {
  let component: LabclientheaderComponent;
  let fixture: ComponentFixture<LabclientheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabclientheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabclientheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
