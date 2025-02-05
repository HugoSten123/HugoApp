import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser'; // Import the Title service
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

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle(this.activatedRoute.root);
      }
    });
  }

  private updateTitle(route: ActivatedRoute): void {
    let newTitle = 'Hugos dagbok';

    while (route.firstChild) {
      route = route.firstChild;
      if (route.snapshot.data['title']) {
        newTitle = `${this.title} - ${route.snapshot.data['title']}`; 
      }
    }

    this.titleService.setTitle(newTitle); 
  }
}
