import { Component, inject, model, OnInit } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { SiteDataService } from '../../services/site-data-service.service';
@Component({
  selector: 'app-gallery',
  imports: [GalleriaModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {

   private siteDataService = inject(SiteDataService);
  
  displayCustom: boolean = true;

  activeIndex: number = 0;

  images = model<string[]>([]);

  videos = model<string[]>([]);

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  ngOnInit() {
    this.siteDataService.gallery.subscribe(gallery => {
      this.images.set(gallery.images);
      this.videos.set(gallery.videos);
    });
  }


  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
}
