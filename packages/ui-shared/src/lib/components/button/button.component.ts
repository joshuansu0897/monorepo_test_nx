import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'shared-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() variant: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';
  @Input() size: 'small' | 'normal' | 'large' = 'normal';
  @Input() disabled = false;
  @Output() click = new EventEmitter<void>();

  get buttonClasses(): string {
    const classes = ['btn', `btn-${this.variant}`];
    
    if (this.size !== 'normal') {
      classes.push(`btn-${this.size}`);
    }
    
    return classes.join(' ');
  }

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}
