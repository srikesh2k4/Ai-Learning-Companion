import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { AiAgentComponent } from './components/shared/ai-agent/ai-agent.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
import { Loading } from './components/shared/loading/loading';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, AiAgentComponent,Loading],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  showNavbar = false;
  showAiAgent = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateNavbarVisibility(this.router.url);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.updateNavbarVisibility(event.url);
    });
  }

  private updateNavbarVisibility(url: string): void {
    const authRoutes = ['/login', '/register'];
    const isAuthRoute = authRoutes.some(route => url.includes(route));
    const isAuthenticated = this.authService.isAuthenticated();

    this.showNavbar = !isAuthRoute && isAuthenticated;
    this.showAiAgent = !isAuthRoute && isAuthenticated;
  }
}
