import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter<boolean>();
  registerForm!: FormGroup;
  maxDate: Date;
  validationErrors: string[] | null = null;
  loading = false;
  success = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Set maximum date to 18 years ago
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  // Initialize the registration form
  initializeForm() {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        dateOfBirth: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        gender: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(9),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.validationErrors = null;

    const dob = this.getDateOnly(
      this.registerForm.controls['dateOfBirth'].value
    );
    const values = { ...this.registerForm.value, dateOfBirth: dob };

    this.accountService.register(values).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastr.success(
          response.message ||
            'Iyandikishe neza! Nyamuneka reba email yawe kugira ngo wemeze konti.'
        );
        this.registerForm.reset();
        this.router.navigateByUrl('/email-confirmation-required');
      },
      error: (err) => {
        this.loading = false;
        if (err.error && Array.isArray(err.error)) {
          this.validationErrors = err.error.map((e: any) => e.description);
        } else if (err.error && typeof err.error === 'string') {
          this.validationErrors = [err.error];
        } else {
          this.validationErrors = ['An unknown error occurred.'];
        }
        // this.loading = false;
        this.toastr.error('Iyandikishe ntiyagenze neza.');
      },
    });
  }

  private getDateOnly(dob: string | undefined): string | null {
    if (!dob) return null;

    let theDob = new Date(dob);
    return new Date(
      theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }

  // Handle cancel action
  cancel() {
    this.cancelRegister.emit(false);
  }
}
