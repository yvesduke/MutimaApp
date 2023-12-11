import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { Pagination } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';
// import { UserParams } from 'src/app/_models/userParams';
import { UserParams } from 'src/app/_models/userParams';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  // members$: Observable<Member[]> | undefined;
  members: Member[] = [];
  pagination: Pagination | undefined;
  pageNumber = 1;
  pageSize = 5;
  userParams: UserParams | undefined;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    // this.members$ = this.memberService.getMembers();
    this.loadMembers();
  }

  // loadMembers() {
  //   this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
  //     next: response => {
  //       if (response.result && response.pagination) {
  //         this.members = response.result;
  //         this.pagination = response.pagination;
  //       }
  //     }
  //   })
  // }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        },
      });
    }
  }

  // pageChanged(event: any) {
  //   if (this.pageNumber !== event.page) {
  //     this.pageNumber = event.page;
  //     this.loadMembers();
  //   }
  // }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams?.pageNumber !== event.page) {
      this.memberService.setUserParams(this.userParams);
      this.userParams.pageNumber = event.page;
      this.loadMembers();
    }
  }
}
