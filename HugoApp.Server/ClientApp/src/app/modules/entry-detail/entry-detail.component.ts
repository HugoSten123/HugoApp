import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntriesService, Entry } from 'app/core/services/entries.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-entry-detail',
  templateUrl: './entry-detail.component.html',
  styleUrls: ['./entry-detail.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class EntryDetailComponent implements OnInit {
  entry: Entry | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private entriesService: EntriesService,
    private location: Location,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entriesService.getEntryById(id).subscribe({
        next: (entry) => {
          this.entry = entry;

          this.titleService.setTitle(`Hugos dagbok - ${entry.title}`);

          this.metaService.updateTag({ name: 'description', content: entry.content.slice(0, 150) });
          this.metaService.updateTag({ property: 'og:title', content: entry.title });
          this.metaService.updateTag({ property: 'og:description', content: entry.content.slice(0, 150) });
          if (entry.imageUrl) {
            this.metaService.updateTag({ property: 'og:image', content: entry.imageUrl });
          }
        },
        error: (err) => {
          console.error('Error fetching entry:', err);
          this.router.navigate(['/']);
        },
      });

    }
  }

  goBack(): void {
    this.location.back();
  }


  shareOnFacebook(): void {
    const currentUrl = window.location.href; 
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;

    window.open(facebookUrl, '_blank', 'width=600,height=400');
  }
}
