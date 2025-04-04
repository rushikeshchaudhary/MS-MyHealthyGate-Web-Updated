import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicContnetComponent } from './dynamic-contnet.component';

describe('DynamicContnetComponent', () => {
  let component: DynamicContnetComponent;
  let fixture: ComponentFixture<DynamicContnetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicContnetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicContnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
