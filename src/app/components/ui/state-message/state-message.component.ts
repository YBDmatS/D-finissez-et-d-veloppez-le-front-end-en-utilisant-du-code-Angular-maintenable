import { Component, Input } from '@angular/core';

export type MessageState = 'loading' | 'error' | 'empty';

@Component({
  selector: 'app-state-message',
  templateUrl: './state-message.component.html',
  styleUrls: ['./state-message.component.scss'],
})
export class StateMessageComponent {
  @Input() state!: MessageState;
  @Input() message?: string;
}
