import { Pipe, PipeTransform, inject } from '@angular/core';
import { Language } from '../services/language';


@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // important so pipe updates when language changes
})
export class TranslatePipe implements PipeTransform {

  private langService = inject(Language);


  transform(value: string): string {
    return this.langService.translate(value);
  }

}
