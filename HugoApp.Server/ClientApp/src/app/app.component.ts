import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
export class AppComponent {
  title = 'AJP Checkout';
}
