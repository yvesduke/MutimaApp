import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-resend-confirmation-email',
  templateUrl: './resend-confirmation-email.component.html',
  styleUrls: ['./resend-confirmation-email.component.css'],
})
export class ResendConfirmationEmailComponent implements OnInit {
  resendForm!: FormGroup;
  loading = false;
  validationErrors: string[] | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resendForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  resend() {
    if (this.resendForm.invalid) return;
    this.loading = true;
    this.validationErrors = null;

    this.accountService
      .resendConfirmationEmail(this.resendForm.value)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.toastr.success(response.message);
          this.resendForm.reset();
        },
        error: (err) => {
          if (err.error && Array.isArray(err.error)) {
            this.validationErrors = err.error.map((e: any) => e.description);
          } else if (err.error && typeof err.error === 'string') {
            this.validationErrors = [err.error];
          } else {
            this.validationErrors = ['An unknown error occurred.'];
          }
          this.loading = false;
          this.toastr.error('Resending confirmation email failed.');
        },
      });
  }
}
