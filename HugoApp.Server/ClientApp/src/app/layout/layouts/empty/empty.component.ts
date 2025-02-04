import { NgIf, NgClass } from '@angular/common';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';

import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';

@Component({
  selector: 'empty-layout',
  templateUrl: './empty.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [FuseLoadingBarComponent, NgIf, NgClass, RouterOutlet, RouterModule] // Add NgClass here
})
export class EmptyLayoutComponent implements OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  menuOpen: boolean = false; // State to track if the menu is open

  /**
   * Constructor
   */
  constructor() {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the navigation menu
   */
  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
