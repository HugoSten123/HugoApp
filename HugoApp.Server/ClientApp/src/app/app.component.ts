import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser'; // Import Meta service
import { HttpClientModule } from '@angular/common/http';
import { EntriesComponent } from './modules/entries/entries.component';
import { EditorComponent } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, EntriesComponent, EditorComponent],
})
export class AppComponent implements OnInit {
  title = 'Hugos dagbok';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta // Inject Meta service
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitleAndMeta(this.activatedRoute.root);
      }
    });

    // Set default meta tags
    this.setDefaultMetaTags();
  }

  private updateTitleAndMeta(route: ActivatedRoute): void {
    let newTitle = 'Hugos dagbok';

    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data['title']) {
        newTitle = `${this.title} - ${route.snapshot.data['title']}`;
      }
    }

    this.titleService.setTitle(newTitle);
    this.updateMetaTags(newTitle);
  }

  private updateMetaTags(title: string): void {
    this.metaService.updateTag({ name: 'description', content: `Läs ${title} på Hugos dagbok!` });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: `Utforska Hugos senaste inlägg: ${title}.` });
  }

  private setDefaultMetaTags(): void {
    this.metaService.addTags([
      { name: 'description', content: 'Välkommen till Hugos dagbok - en blogg om vardagen!' },
      { property: 'og:title', content: 'Hugos dagbok' },
      { property: 'og:description', content: 'Läs Hugos senaste tankar och äventyr.' },
      { property: 'og:image', content: 'assets/default-image.jpg' }
    ]);
  }
}
