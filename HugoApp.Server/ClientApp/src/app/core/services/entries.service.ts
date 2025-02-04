import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Entry {
  id?: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EntriesService {
  private apiUrl = 'api';

  constructor(private http: HttpClient) { }

  getEntries(): Observable<Entry[]> {
    console.log('Fetching entries...');
    return this.http.get<Entry[]>(`${this.apiUrl}/entry/get`);
  }

  getEntryById(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiUrl}/entry/get/${id}`);
  }

  addEntry(entry: Entry): Observable<Entry> {
    console.log('Adding new entry:', entry);
    return this.http.post<Entry>(`${this.apiUrl}/entry/save`, entry).pipe(
      tap((newEntry) => {
        console.log('New entry saved:', newEntry);
        entry.id = newEntry.id; 
      })
    );
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/entry/upload-image`, formData);
  }

  updateEntry(entry: Entry): Observable<Entry> {
    if (!entry.id) {
      throw new Error('Entry ID is required for update');
    }
    return this.http.put<Entry>(`${this.apiUrl}/entry/update/${entry.id}`, entry).pipe(
      tap(() => console.log(`Entry updated: ${entry.id}`))
    );
  }

  deleteEntry(id: string): Observable<any> {
    console.log(`Deleting entry with id: ${id}`);
    return this.http.delete(`${this.apiUrl}/entry/delete/${id}`).pipe(
      tap(() => console.log(`Entry deleted: ${id}`))
    );
  }
}
