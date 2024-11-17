import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonCardManagerComponent } from './lesson-card-manager.component';

describe('LessonCardManagerComponent', () => {
  let component: LessonCardManagerComponent;
  let fixture: ComponentFixture<LessonCardManagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonCardManagerComponent]
    });
    fixture = TestBed.createComponent(LessonCardManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
