import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfirmationRequiredComponent } from './email-confirmation-required.component';

describe('EmailConfirmationRequiredComponent', () => {
  let component: EmailConfirmationRequiredComponent;
  let fixture: ComponentFixture<EmailConfirmationRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailConfirmationRequiredComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailConfirmationRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
