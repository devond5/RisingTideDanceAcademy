import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { SiteDataService } from './services/site-data-service.service';
import { faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  faInstagram = faInstagram;
  faYoutube = faYoutube;
  private siteDataService = inject(SiteDataService);
  title = 'rising-tide-dance-academy';
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public isMenuOpen = signal(false);

  public isMobile = signal(false);
  public currentPath = signal('');

  faBars = faBars;
  faXmark = faXmark;

  mobileMenuOpen = signal<boolean>(false);

  ngOnInit(): void {
    this.siteDataService.getAllData();
  }

  navigateTo(path: string) {
    this.router.navigate([path], { relativeTo: this.route });
    this.currentPath.set(path);
  }

  // Actions & Methods
  toggleMobileMenu(open: boolean) {
    this.mobileMenuOpen.set(open);
  }
}
