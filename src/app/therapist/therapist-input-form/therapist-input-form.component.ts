import { RecordingIconComponent, StopIconComponent } from '@/shared/icons/record-icon.component';
import { SendIconComponent } from '@/shared/icons/send-icon.component';
import { SpinnerIconComponent } from '@/shared/icons/spinner-icon.component';
import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conversation-input-form',
  imports: [
    FormsModule,
    SpinnerIconComponent,
    SendIconComponent,
    RecordingIconComponent,
    StopIconComponent,
  ],
  templateUrl: './therapist-input-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapistInputFormComponent {
  pauseSendPrompt = input(false);
  isGeneratingImage = input(false);
  prompt = model('');

  newEditRequest = output<string>();

  trimmedPrompt = computed(() => this.prompt().trim());
  isEmptyPrompt = computed(() => !this.trimmedPrompt().length);

  isRecording = signal(false);
  recordingStateChanged = output<boolean>();

  async handleSendPrompt(): Promise<void> {
    if (this.isEmptyPrompt() || this.pauseSendPrompt()) {
      return;
    }

    this.newEditRequest.emit(this.trimmedPrompt());

    this.prompt.set('');
  }

  recordAudio() {
    this.isRecording.update(isRecording => !isRecording);
    this.recordingStateChanged.emit(this.isRecording());
  }
}
