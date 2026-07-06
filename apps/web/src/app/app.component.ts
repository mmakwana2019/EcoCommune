import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { DataService } from './services/data.service';
import { AIInsight, CommunityBenchmark } from '../../../../libs/shared-types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  insights: AIInsight[] = [];
  benchmarks: CommunityBenchmark[] = [];
  
  chatMessages: {role: 'user' | 'assistant', text: string}[] = [
    { role: 'assistant', text: 'Hi! I am your AI assistant grounded in your resource data. Ask me anything about your consumption.' }
  ];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getInsights().subscribe(data => this.insights = data);
    this.dataService.getBenchmarks().subscribe(data => this.benchmarks = data);
  }

  logResource(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value;
    const amount = (form.elements.namedItem('amount') as HTMLInputElement).value;
    
    alert(`Mock logged ${amount} for ${type}. In production this would trigger the Cloud Function processResourceLog.`);
    form.reset();
  }

  sendMessage(event: any) {
    const input = event.target as HTMLInputElement;
    const text = input.value.trim();
    if (!text) return;

    this.chatMessages.push({ role: 'user', text });
    input.value = '';

    // Mock RAG AI Response
    setTimeout(() => {
      this.chatMessages.push({ 
        role: 'assistant', 
        text: `Based on your recent data, your ${text.includes('water') ? 'water' : 'electricity'} spike is likely due to seasonal changes. You are still performing well compared to the neighborhood average!`
      });
    }, 1000);
  }
}
