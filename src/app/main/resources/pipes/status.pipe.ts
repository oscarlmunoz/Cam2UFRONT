import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {


  transform(value: any): any {

    let possibleStatus: any = [];
    possibleStatus.push(
      { id: 0, name: "En proceso" },
      { id: 1, name: 'Preparado' },
      { id: 2, name: 'Enviado' },
      { id: 3, name: 'Entregado' },
      { id: 4, name: 'Cancelado' }
    );
    try {
      return possibleStatus[value].name;
    } catch {
      return value;
    }
  }

}
