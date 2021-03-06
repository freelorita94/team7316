import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

//Import Components
import { AppComponent } from '../app/app.component';
import { AuthComponent } from './auth/auth.component';
import { CannotFindPageComponent } from './cannot-find-page/cannot-find-page.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { FilterComponent } from '../app/filter/filter.component';
import { ManageEventsComponent } from './manage-events/manage-events.component';
import { MapComponent } from './map/map.component';
import { ChatroomComponent } from './chat/chatroom/chatroom.component';

//Import Guards
import { AdminGuard } from './auth/admin.guard';
import { CanReadGuard } from './auth/can-read.guard';
import { CanEditGuard } from './auth/can-edit.gaurd';
import { NonProfitAccountComponent } from './account/non-profit-account/non-profit-account.component';
import { VolunteerAccountComponent } from './account/volunteer-account/volunteer-account.component';


const appRoutes: Routes = [
  { path: 'mapview', component: MapComponent}, // Want users not logged in to be able to see volunteer opportunities
  { path: 'authview', component: AuthComponent},
  { path: 'editpostview', component: EditPostComponent, canActivate: [CanEditGuard]},
  { path: 'eventview', component: ManageEventsComponent},
  { path: 'filter', component: FilterComponent },
  { path: 'chat', component: ChatroomComponent },
  { path: 'account-np', component: NonProfitAccountComponent},
  { path: 'account-v', component: VolunteerAccountComponent},
  { path: '', redirectTo: '/mapview', pathMatch: 'full'},
  { path: '**', component: CannotFindPageComponent}
] 


@NgModule({
    imports: [
        RouterModule.forRoot(
          appRoutes, 
          { enableTracing: false})
    ],
    declarations: [],
    exports: [
      RouterModule
    ],
    providers: []
  })

  export class AppRoutingModule { }