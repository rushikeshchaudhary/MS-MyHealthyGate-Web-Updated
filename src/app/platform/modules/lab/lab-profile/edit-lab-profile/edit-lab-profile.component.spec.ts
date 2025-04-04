import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabProfileComponent } from './edit-lab-profile.component';

describe('EditLabProfileComponent', () => {
  let component: EditLabProfileComponent;
  let fixture: ComponentFixture<EditLabProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLabProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLabProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
