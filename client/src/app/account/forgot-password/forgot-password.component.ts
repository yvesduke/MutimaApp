import { Component } from '@angular/core';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  model: any = {};
  loading = false;
  success = false;
  error = '';

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService
  ) {}

  onSubmit() {
    if (!this.model.email) {
      this.error = 'Injiza email yawe.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.accountService.forgotPassword(this.model.email).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.toastr.success(
          "Niba email yawe ari iyukuri, uzakira link yo kuzimya ijambo ry'ibanga."
        );
      },
      error: (err) => {
        this.error = err.error || 'Failed to send password reset link.';
        this.loading = false;
        this.toastr.error(this.error);
      },
    });
  }
}
