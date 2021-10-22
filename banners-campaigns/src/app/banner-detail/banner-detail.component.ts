import { Component, OnInit, Input } from '@angular/core';
import { Banner } from '../banner';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BannerService }  from '../banner.service';

@Component({
  selector: 'app-banner-detail',
  templateUrl: './banner-detail.component.html',
  styleUrls: ['./banner-detail.component.css']
})
export class BannerDetailComponent implements OnInit {

  @Input()
  banner!: Banner;

  constructor(
    private route: ActivatedRoute,
    private bannerService: BannerService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getBanner();
  }

  getBanner(): void {
    const id = +Number(this.route.snapshot.paramMap.get('id'));
    
    this.bannerService.getBanner(id)
      .subscribe(banner => this.banner = banner);
  }
  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.bannerService.updateBanner(this.banner)
      .subscribe(() => this.goBack());
  }
}
