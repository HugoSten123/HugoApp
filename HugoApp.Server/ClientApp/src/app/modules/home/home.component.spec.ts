import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Setup testing environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent] // Import the component to test
    })
      .compileComponents(); // Compile component's templates and styles

    // Create component fixture and instance
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection
  });

  // Test to check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy(); // Expect the component to be truthy
  });
});
