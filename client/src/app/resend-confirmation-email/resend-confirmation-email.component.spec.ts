import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendConfirmationEmailComponent } from './resend-confirmation-email.component';

describe('ResendConfirmationEmailComponent', () => {
  let component: ResendConfirmationEmailComponent;
  let fixture: ComponentFixture<ResendConfirmationEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResendConfirmationEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResendConfirmationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
