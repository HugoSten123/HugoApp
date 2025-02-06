import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser'; // Import Meta service for updating metadata
import { HttpClientModule } from '@angular/common/http';
import { EntriesComponent } from './modules/entries/entries.component';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, EntriesComponent, EditorComponent], // Import necessary modules
})
export class AppComponent implements OnInit {
  title = 'Hugos dagbok'; // Default title

  constructor(
    private router: Router, // Router service to listen to navigation events
    private activatedRoute: ActivatedRoute, // ActivatedRoute service to access route data
    private titleService: Title, // Title service to set page titles
    private metaService: Meta // Meta service to update meta tags
  ) { }

  ngOnInit(): void {
    // Subscribe to router events to update title and meta tags on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitleAndMeta(this.activatedRoute.root); // Update on navigation end
      }
    });

    // Set default meta tags when the app starts
    this.setDefaultMetaTags();
  }

  private updateTitleAndMeta(route: ActivatedRoute): void {
    let newTitle = 'Hugos dagbok'; // Set default title

    // Traverse the route tree to find the dynamic title
    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data['title']) {
        newTitle = `${this.title} - ${route.snapshot.data['title']}`; // Update title if available
      }
    }

    this.titleService.setTitle(newTitle); // Update document title
    this.updateMetaTags(newTitle); // Update meta tags with the new title
  }

  private updateMetaTags(title: string): void {
    // Update meta tags for SEO and social media sharing
    this.metaService.updateTag({ name: 'description', content: `Läs ${title} på Hugos dagbok!` });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: `Utforska Hugos senaste inlägg: ${title}.` });
  }

  private setDefaultMetaTags(): void {
    // Add default meta tags for the app
    this.metaService.addTags([
      { name: 'description', content: 'Välkommen till Hugos dagbok - en blogg om vardagen!' },
      { property: 'og:title', content: 'Hugos dagbok' },
      { property: 'og:description', content: 'Läs Hugos senaste tankar och äventyr.' },
      { property: 'og:image', content: 'assets/default-image.jpg' }
    ]);
  }
}
