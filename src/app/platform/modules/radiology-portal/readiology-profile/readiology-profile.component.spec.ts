import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadiologyProfileComponent } from './readiology-profile.component';

describe('ReadiologyProfileComponent', () => {
  let component: ReadiologyProfileComponent;
  let fixture: ComponentFixture<ReadiologyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadiologyProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadiologyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
