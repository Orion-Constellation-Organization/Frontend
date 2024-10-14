import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSuccessModalComponent } from './registration-success-modal.component';

describe('RegistrationSuccessModalComponent', () => {
  let component: RegistrationSuccessModalComponent;
  let fixture: ComponentFixture<RegistrationSuccessModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationSuccessModalComponent]
    });
    fixture = TestBed.createComponent(RegistrationSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
