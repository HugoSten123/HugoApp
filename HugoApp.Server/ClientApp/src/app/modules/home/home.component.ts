import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EntriesService, Entry } from '../../core/services/entries.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule] // Import necessary modules
})
export class HomeComponent implements OnInit {

  entryService = inject(EntriesService); // Inject the Entries service
  diaryEntries: Entry[]; // Array to store the diary entries

  // Array of border colors for styling
  borderColors = ['border-red-500', 'border-green-500', 'border-yellow-500', 'border-purple-500'];

  // Fetch diary entries on component initialization
  ngOnInit() {
    this.entryService.getEntries().subscribe(entries => {
      this.diaryEntries = entries; // Store the fetched entries
    });
  }

  /**
   * Determines the border class based on the index
   * @param index - The index of the entry
   * @returns A border color class
   */
  getBorderClass(index: number): string {
    return `${this.borderColors[index % this.borderColors.length]} border`; // Return the border class
  }

  // Log the entry when an entry is clicked
  logEntry(entry: Entry): void {
    console.log('Navigating to entry:', entry);
  }

}
