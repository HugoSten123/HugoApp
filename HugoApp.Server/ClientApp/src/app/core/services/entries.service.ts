import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Entry interface representing the structure of an entry object.
export interface Entry {
  id?: string;         // Optional unique identifier (GUID)
  title: string;       // The title of the entry
  content: string;     // The content of the entry
  date: string;        // The date the entry was created
  imageUrl?: string;   // The URL of an image associated with the entry (optional)
}

@Injectable({
  providedIn: 'root',  // This service is provided globally in the application
})
export class EntriesService {
  private apiUrl = 'api';  // Base URL for the API

  // Constructor to inject the HttpClient service for making HTTP requests
  constructor(private http: HttpClient) { }

  // Method to fetch all entries from the backend API
  getEntries(): Observable<Entry[]> {
    console.log('Fetching entries...');
    return this.http.get<Entry[]>(`${this.apiUrl}/entry/get`); // Sends a GET request to fetch all entries
  }

  // Method to fetch a specific entry by its ID
  getEntryById(id: string): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiUrl}/entry/get/${id}`); // Sends a GET request to fetch a single entry by ID
  }

  // Method to add a new entry to the backend
  addEntry(entry: Entry): Observable<Entry> {
    console.log('Adding new entry:', entry);
    return this.http.post<Entry>(`${this.apiUrl}/entry/save`, entry).pipe(
      tap((newEntry) => {
        console.log('New entry saved:', newEntry);
        entry.id = newEntry.id;  // Assign the ID of the new entry back to the original entry object
      })
    );
  }

  // Method to upload an image file and return the image URL
  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();  // FormData is used to send files
    formData.append('file', file);    // Append the file to the FormData object
    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/entry/upload-image`, formData);
    // Sends a POST request to upload the image and retrieve the image URL
  }

  // Method to update an existing entry
  updateEntry(entry: Entry): Observable<Entry> {
    if (!entry.id) {
      throw new Error('Entry ID is required for update');  // Ensure the entry has an ID before updating
    }
    return this.http.put<Entry>(`${this.apiUrl}/entry/update/${entry.id}`, entry).pipe(
      tap(() => console.log(`Entry updated: ${entry.id}`))  // Log the ID of the updated entry
    );
  }

  // Method to delete an entry by its ID
  deleteEntry(id: string): Observable<any> {
    console.log(`Deleting entry with id: ${id}`);
    return this.http.delete(`${this.apiUrl}/entry/delete/${id}`).pipe(
      tap(() => console.log(`Entry deleted: ${id}`))  // Log the ID of the deleted entry
    );
  }
}
