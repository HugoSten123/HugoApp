import { Component } from '@angular/core';

// Defines the AboutComponent with metadata
@Component({
  selector: 'app-about', // The selector used to include this component in templates
  templateUrl: './about.component.html', // Links to the HTML template for this component
  styleUrls: ['./about.component.scss'], // Links to the SCSS styles for this component
  standalone: true // Marks this component as a standalone component, meaning it doesn't require a module
})
export class AboutComponent { } // Defines an empty class for the component
