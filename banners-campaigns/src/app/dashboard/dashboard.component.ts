import { Component, OnInit } from '@angular/core';
import { Banner } from '../banner';
import { BannerService } from '../banner.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  banners: Banner[] = [];

  constructor(private bannerService: BannerService) { }

  ngOnInit() {
    this.getBanners();
  }
  getBanners(): void {
    this.bannerService.getBanners()
      .subscribe(banners => this.banners = banners.slice(1, 5));
  }
}
