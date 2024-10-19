import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from '../login/login.module';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    HomeRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    LoginModule,
  ],
  providers: [],
  bootstrap: [HomeComponent]
})
export class HomeModule { }