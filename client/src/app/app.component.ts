import { Component } from '@angular/core';
import { AccountService } from './_services/account.service';
import { User } from './_models/user';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as rwandaStrings } from 'ngx-timeago/language-strings/rw';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Mutima';

  constructor(private accountService: AccountService, intl: TimeagoIntl) {
    intl.strings = rwandaStrings;
    intl.changes.next();
  }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
