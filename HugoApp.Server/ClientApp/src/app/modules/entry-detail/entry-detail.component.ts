import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntriesService, Entry } from 'app/core/services/entries.service';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser'; 

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
    private titleService: Title  
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.entriesService.getEntryById(id).subscribe({
        next: (entry) => {
          this.entry = entry;
          this.titleService.setTitle(`AJP Checkout - Entry Detail: ${entry.title}`);  
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
}
