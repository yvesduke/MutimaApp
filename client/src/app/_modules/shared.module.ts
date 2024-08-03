import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {
  TimeagoModule,
  TimeagoIntl,
  TimeagoFormatter,
  TimeagoCustomFormatter,
} from 'ngx-timeago';
import { ModalModule } from 'ngx-bootstrap/modal';

export class MyIntl extends TimeagoIntl {
  // do extra stuff here...
  // TODO:-- Check if we need to do more
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    NgxSpinnerModule.forRoot({
      type: 'line-scale-party',
    }),
    FileUploadModule,
    BsDatepickerModule.forRoot(),
    TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl, useClass: MyIntl },
      formatter: {
        provide: TimeagoFormatter,
        useClass: TimeagoCustomFormatter,
      },
    }),
  ],
  exports: [
    BsDropdownModule,
    ToastrModule,
    TabsModule,
    NgxSpinnerModule,
    FileUploadModule,
    BsDatepickerModule,
    PaginationModule,
    ButtonsModule,
    TimeagoModule,
    ModalModule,
  ],
})
export class SharedModule {}
