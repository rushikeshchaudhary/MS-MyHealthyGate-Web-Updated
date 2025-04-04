import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTestMasterdataComponent } from './create-test-masterdata.component';

describe('CreateTestMasterdataComponent', () => {
  let component: CreateTestMasterdataComponent;
  let fixture: ComponentFixture<CreateTestMasterdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTestMasterdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTestMasterdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
