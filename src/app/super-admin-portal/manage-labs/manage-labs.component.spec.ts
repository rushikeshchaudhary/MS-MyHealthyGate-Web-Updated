import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLabsComponent } from './manage-labs.component';

describe('ManageLabsComponent', () => {
  let component: ManageLabsComponent;
  let fixture: ComponentFixture<ManageLabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageLabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
