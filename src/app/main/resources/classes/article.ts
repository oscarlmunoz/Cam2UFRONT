export type ItemSize = 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl';

export interface Article {
    // constructor(
         id_articulo? : number,
         id_prenda: number,
         tamano: ItemSize,
         color: string,
         precio: number,
         publicado: boolean,
         imagen: string,
         nombre: string
    // ){}
}

