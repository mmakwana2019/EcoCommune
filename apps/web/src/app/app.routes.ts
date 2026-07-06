import { Routes } from '@angular/router';
import { ResourceLoggingComponent } from './features/resource-logging/resource-logging.component';
import { AiInsightsComponent } from './features/ai-insights/ai-insights.component';
import { ForecastingComponent } from './features/forecasting/forecasting.component';
import { CommunityBenchmarksComponent } from './features/community-benchmarks/community-benchmarks.component';
import { ChatAssistantComponent } from './features/chat-assistant/chat-assistant.component';

export const routes: Routes = [
  { path: '', redirectTo: 'logging', pathMatch: 'full' },
  { path: 'logging', component: ResourceLoggingComponent },
  { path: 'insights', component: AiInsightsComponent },
  { path: 'forecasting', component: ForecastingComponent },
  { path: 'benchmarks', component: CommunityBenchmarksComponent },
  { path: 'assistant', component: ChatAssistantComponent },
  { path: '**', redirectTo: 'logging' }
];

