import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css'],
})
export class ConfirmEmailComponent implements OnInit {
  baseUrl = environment.apiUrl;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = params['userId'];
      const token = params['token'];

      if (userId && token) {
        this.accountService.confirmEmail(userId, token).subscribe({
          next: () => {
            this.toastr.success('Email yawe yaremejwe neza!');
            this.router.navigateByUrl('/email-confirmed');
          },
          error: (err) => {
            this.toastr.error(err?.err || 'Email confirmation failed.');
            this.router.navigateByUrl('/register');
          },
        });
      }
    });
  }
}
