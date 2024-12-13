import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-learn-more',
  templateUrl: './learn-more.component.html',
  styleUrls: ['./learn-more.component.css'],
})
export class LearnMoreComponent implements OnInit {
  //learnMoreMode = false;

  constructor(private router: Router) {}

  ngOnInit() {}

  learnMoreToggle() {
    // this.learnMoreMode = true;
    //this.registerMode = true;
    console.log('Iyandikishe Click Event');
    this.router.navigate(['/home']);
  }
}
