import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMastersecurityquestionComponent } from './create-mastersecurityquestion.component';

describe('CreateMastersecurityquestionComponent', () => {
  let component: CreateMastersecurityquestionComponent;
  let fixture: ComponentFixture<CreateMastersecurityquestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateMastersecurityquestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMastersecurityquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
