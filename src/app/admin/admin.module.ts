import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminContainerComponent } from './admin-container/admin-container.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import {UserModule} from '../user/user.module';
import {ArtistManagementModule} from './artist-management/artist-management.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import { AdminLoginComponent } from './admin-login/admin-login.component';

@NgModule({
  declarations: [AdminContainerComponent, DashboardComponent, LoginComponent, AdminLoginComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ArtistManagementModule,
    UserModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    FormsModule,
    TranslateModule
  ],
  exports: [AdminContainerComponent, DashboardComponent, LoginComponent]
})
export class AdminModule { }
