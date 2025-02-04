import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { EntriesService, Entry } from '../../core/services/entries.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, RouterModule]
})
export class HomeComponent implements OnInit {

  entryService = inject(EntriesService);
  diaryEntries: Entry[];

  borderColors = ['border-red-500', 'border-green-500', 'border-yellow-500', 'border-purple-500'];

  ngOnInit() {
    this.entryService.getEntries().subscribe(entries => {
      this.diaryEntries = entries;
    });
  }

  /**
   * 
   * @param index 
   * @returns 
   */
  getBorderClass(index: number): string {
    return `${this.borderColors[index % this.borderColors.length]} border`;
  }


    logEntry(entry: Entry): void {
      console.log('Navigating to entry:', entry);
    }

  }

