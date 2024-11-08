import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRequestFormComponent } from './class-request-form.component';

describe('ClassRequestFormComponent', () => {
  let component: ClassRequestFormComponent;
  let fixture: ComponentFixture<ClassRequestFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassRequestFormComponent]
    });
    fixture = TestBed.createComponent(ClassRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
