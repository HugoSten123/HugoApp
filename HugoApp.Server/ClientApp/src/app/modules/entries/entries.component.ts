import { Component, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditorModule } from '@tinymce/tinymce-angular';
import { EntriesService, Entry } from 'app/core/services/entries.service';
import { EditorComponent } from '@tinymce/tinymce-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, EditorModule],
})
export class EntriesComponent implements OnInit {
  entries = signal<Entry[]>([]);  // Stores list of entries
  entryForm: FormGroup;  // Form for creating or editing entries
  editingEntry: Entry | null = null;  // Holds the entry being edited
  @ViewChild(EditorComponent) editor: EditorComponent | undefined;  // Reference to the editor component

  borderColors = ['border-red-500', 'border-green-500', 'border-yellow-500', 'border-blue-500'];  // Predefined border colors for entry cards

  selectedImage: string | null = null;  // Holds selected image for preview
  selectedFile: File | null = null;  // Holds selected file for upload

  constructor(
    private fb: FormBuilder,
    private entriesService: EntriesService,
    private sanitizer: DomSanitizer,
    private fuseConfirmationService: FuseConfirmationService,
    private titleService: Title
  ) {
    this.entryForm = this.fb.group({
      title: ['', Validators.required],  // Title form control
      content: ['', Validators.required],  // Content form control
      image: [null],  // Image form control
    });
  }

  ngOnInit(): void {
    this.fetchEntries();  // Fetch entries on component initialization
    this.titleService.setTitle('Hugos dagbok - Inlägg');  // Set the page title
  }

  fetchEntries(): void {
    this.entriesService.getEntries().subscribe({
      next: (data) => this.entries.set(data),  // Set fetched entries
      error: (err) => console.error('Error fetching entries:', err),
    });
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result as string;  // Set the image preview
      };
      reader.readAsDataURL(file);  // Read the file for preview
    }
  }

  addEntry(): void {
    if (this.entryForm.valid) {
      if (this.selectedFile) {
        this.entriesService.uploadImage(this.selectedFile).subscribe({
          next: (response) => this.saveEntry(response.imageUrl),  // Upload image and save entry
          error: (err) => {
            console.error('Error uploading image:', err);
            this.showErrorDialog('Failed to upload image.');
          },
        });
      } else {
        this.saveEntry(null);  // Save entry without image if none selected
      }
    }
  }

  saveEntry(imageUrl: string | null): void {
    const newEntry: Entry = {
      title: this.entryForm.value.title,
      content: this.entryForm.value.content,
      date: new Date().toISOString(),
      imageUrl: imageUrl || "",  // Set image URL if available
    };

    this.entriesService.addEntry(newEntry).subscribe({
      next: () => {
        this.showSuccessDialog('Entry saved successfully!');  // Show success dialog
        this.entries.update((entries) => [newEntry, ...entries]);  // Add the new entry to the list
        this.entryForm.reset();  // Reset the form
        this.selectedImage = null;  // Clear the image preview
        this.selectedFile = null;  // Clear the selected file
      },
      error: (err) => console.error('Error saving entry:', err), //Error meassege
    });
  }

  onEditorChange(content: string): void {
    this.entryForm.controls['content'].setValue(content);  // Update form control when editor content changes
  }

  getBorderClass(index: number): string {
    return this.borderColors[index % this.borderColors.length];  // Return border color based on index
  }

  getSanitizedContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);  // Sanitize HTML content for safe rendering
  }


  //Confirmation
  deleteEntry(entryId: string): void {
    const dialogRef = this.fuseConfirmationService.open({
      title: 'Delete Entry',
      message: 'Are you sure you want to delete this entry?',
      icon: {
        show: true,
        name: 'heroicons_outline:trash',
        color: 'warn',
      },
      actions: {
        confirm: { show: true, label: 'Delete', color: 'warn' },
        cancel: { show: true, label: 'Cancel' },
      },
      dismissible: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this.entriesService.deleteEntry(entryId).subscribe({
          next: () => {
            this.entries.update((entries) => entries.filter(entry => entry.id !== entryId));  // Remove deleted entry from the list
            this.showSuccessDialog('Entry deleted successfully!');
          },
          error: (err) => {
            console.error('Error deleting entry:', err);
            this.showErrorDialog('Failed to delete entry.');
          }
        });
      }
    });
  }

  startEditing(entry: Entry): void {
    console.log("Editing entry:", entry);
    this.editingEntry = { ...entry };  // Set entry as being edited
    this.entryForm.patchValue({
      title: entry.title,
      content: entry.content,
    });
    this.selectedImage = entry.imageUrl || null;  // Set image preview if available
  }

  saveEditedEntry(): void {
    if (!this.editingEntry) return;

    const updatedEntry: Entry = {
      ...this.editingEntry,
      title: this.entryForm.value.title,
      content: this.entryForm.value.content,
    };

    console.log("Saving updated entry:", updatedEntry);

    this.entriesService.updateEntry(updatedEntry).subscribe({
      next: () => {
        this.showSuccessDialog('Entry updated successfully!');
        this.entries.update((entries) =>
          entries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))  // Update the entry in the list
        );
        this.cancelEditing();  // Reset the form after editing
      },
      error: (err) => {
        console.error("Error updating entry:", err);
        this.showErrorDialog('Failed to update entry.');
      },
    });
  }

  cancelEditing(): void {
    this.editingEntry = null;  // Clear editing state
    this.entryForm.reset();  // Reset the form
    this.selectedImage = null;  // Clear the image preview
    this.selectedFile = null;  // Clear the selected file
  }

  private showSuccessDialog(message: string): void {
    this.fuseConfirmationService.open({
      title: 'Success',
      message: message,
      icon: { show: true, name: 'heroicons_outline:check-circle', color: 'success' },
      actions: { confirm: { show: true, label: 'OK', color: 'primary' } },
      dismissible: true,
    });
  }

  private showErrorDialog(message: string): void {
    this.fuseConfirmationService.open({
      title: 'Error',
      message: message,
      icon: { show: true, name: 'heroicons_outline:x-circle', color: 'error' },
      actions: { confirm: { show: true, label: 'OK', color: 'warn' } },
      dismissible: true,
    });
  }
}
