import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { ResetPassword } from 'src/app/_models/resetPassword';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  model: ResetPassword = {
    email: '',
    token: '',
    newPassword: '',
  };
  loading = false;
  success = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const email = params.get('email');
      const token = params.get('token');

      if (email && token) {
        this.model.email = email;
        this.model.token = token;
      } else {
        this.error = 'Invalid password reset request.';
      }
    });
  }

  onSubmit() {
    if (!this.model.newPassword) {
      this.error = "Injiza ijambo ry'ibanga rishya.";
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    this.accountService.resetPassword(this.model).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.toastr.success("Ijambo ry'ibanga ryazimye neza!");
      },
      error: (err) => {
        this.error = err.error || 'Failed to reset password.';
        this.loading = false;
        this.toastr.error(this.error);
      },
    });
  }
}
