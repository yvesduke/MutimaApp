import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  // Parent to child Communication
  // @Input() usersFromHomeComponent: any;
  // Child to parent Communication 
  @Output() cancelRegister = new EventEmitter(); 
  model: any = {}

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  register() {
    // console.log(this.model);
    this.accountService.register(this.model).subscribe({
      // next: response => {
        next: () => {
        // console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    })
  }

  cancel() {
    console.log('cancelled');
    this.cancelRegister.emit(false); // Child to parent Communication
  }

}
