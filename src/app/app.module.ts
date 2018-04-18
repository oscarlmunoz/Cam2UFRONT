// ANGULAR
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// COMPONENTS
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { GalleryComponent } from './main/public/gallery/gallery.component';
import { ContactComponent } from './main/public/contact/contact.component';
import { NavbarComponent } from './main/resources/navbar/navbar.component';
import { DesignerComponent } from './main/public/designer/designer.component';

// PRIMENG
import { CardModule } from 'primeng/card';
import { GrowlModule } from 'primeng/growl';
import { SidebarModule } from 'primeng/sidebar';
import { DataListModule } from 'primeng/datalist';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AccordionModule } from 'primeng/accordion';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TableModule } from 'primeng/table';
import { SpinnerModule } from 'primeng/spinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';




// FONT AWESOME
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ButtonModule } from 'primeng/button';
import { CartComponent } from './main/public/cart/cart.component';

//SERVICES
import { CartService } from './main/resources/services/cart.service';
import { SafePipe } from './main/resources/pipes/safe.pipe';
import { LoginComponent } from './main/resources/login/login.component';
import { CustomerService } from './main/resources/services/customer.service';
import { ArticleManagerComponent } from './main/private/article-manager/article-manager.component';
import { OrderManagerComponent } from './main/private/order-manager/order-manager.component';
import { AuthService } from './main/resources/services/auth.service'
import { AdminService } from './main/resources/services/admin.service';


//GUARD
import { AuthGuard } from './main/resources/guard/auth.guard'
import { LoginService } from './main/resources/services/login.service';
import { StatusPipe } from './main/resources/pipes/status.pipe';
import { CustomOrderManagerComponent } from './main/private/custom-order-manager/custom-order-manager.component';

// ROUTES
const appRoutes: Routes = [
  { path: '', redirectTo: '/gallery', pathMatch: 'full' },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'designer', component: DesignerComponent },
  { path: 'article_manager', component: ArticleManagerComponent, canActivate: [AuthGuard] },
  { path: 'order_manager', component: OrderManagerComponent, canActivate: [AuthGuard] },
  { path: 'custom_order_manager', component: CustomOrderManagerComponent }

  
]
// TODO check proper server routing when reload

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    GalleryComponent,
    ContactComponent,
    NavbarComponent,
    DesignerComponent,
    CartComponent,
    SafePipe,
    LoginComponent,
    ArticleManagerComponent,
    OrderManagerComponent,
    StatusPipe,
    CustomOrderManagerComponent
  ],
  imports: [
    RouterModule,
    RouterModule.forRoot(appRoutes, {useHash: true}),
    BrowserModule,
    CardModule,
    AngularFontAwesomeModule,
    ButtonModule,
    HttpModule,
    GrowlModule,
    SidebarModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    DataListModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    AccordionModule,
    InputTextareaModule,
    InputSwitchModule,
    ConfirmDialogModule,
    ToggleButtonModule,
    TableModule,
    SpinnerModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    ProgressBarModule
  ],
  providers: [
    CartService,
    AuthGuard,
    AuthService,
    LoginComponent,
    CustomerService,
    ConfirmationService,
    AdminService,
    LoginService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
