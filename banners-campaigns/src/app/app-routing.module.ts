import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannersComponent } from './banners/banners.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BannerDetailComponent } from './banner-detail/banner-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CampaignsComponent } from './campaigns/campaigns.component';

const routes: Routes = [
  { path: 'banners', component: BannersComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'detail/:id', component: BannerDetailComponent },
  { path: 'campaigns', component: CampaignsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes), HttpClientModule ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
