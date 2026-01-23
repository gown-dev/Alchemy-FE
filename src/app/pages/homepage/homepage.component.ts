import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomeComponent {
  announcements: string[] = [
    'Wow',
    'This is announcement',
    'Another one',
    'Last one',
  ];

  hotTopics = [
    { title: 'What are you guys doing?' },
    { title: 'New show Blood of my blood' },
    { title: 'Im tired of working' },
    { title: 'This is my third forum' },
  ];

  shopUpdates: string[] = ['assets/shop1.png', 'assets/shop2.png'];

  friendsActivity = [
    { username: 'username', action: 'did something', time: '2m' },
  ];

  inventory = Array(12).fill(null);

  constructor(private router: Router) {}

  goToAlchemy() {
    this.router.navigate(['/alchemy']);
  }
}
