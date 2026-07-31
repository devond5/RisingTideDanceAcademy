import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { DaBarreComponent } from './components/da-barre/da-barre.component';
import { ScheduleTuitionComponent } from './components/schedule-tuition/schedule-tuition.component';
import { ClassesComponent } from './components/classes/classes.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
  },
  {
    path: 'gallery',
    component: GalleryComponent,
  },
  {
    path: 'da-barre',
    component: DaBarreComponent,
  },
  {
    path: 'schedule-tuition',
    component: ScheduleTuitionComponent,
  },
  {
    path: 'classes',
    component: ClassesComponent,
  },
];
