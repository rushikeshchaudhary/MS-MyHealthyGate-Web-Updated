import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOtherItemsOncalenderComponent } from './add-other-items-oncalender.component';

describe('AddOtherItemsOncalenderComponent', () => {
  let component: AddOtherItemsOncalenderComponent;
  let fixture: ComponentFixture<AddOtherItemsOncalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOtherItemsOncalenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOtherItemsOncalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
