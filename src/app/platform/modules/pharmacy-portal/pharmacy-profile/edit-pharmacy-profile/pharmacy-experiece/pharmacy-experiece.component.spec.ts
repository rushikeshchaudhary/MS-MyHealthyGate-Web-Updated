import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyExperieceComponent } from './pharmacy-experiece.component';

describe('PharmacyExperieceComponent', () => {
  let component: PharmacyExperieceComponent;
  let fixture: ComponentFixture<PharmacyExperieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmacyExperieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmacyExperieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
