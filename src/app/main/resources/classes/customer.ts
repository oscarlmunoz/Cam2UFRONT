export class Customer {
    constructor(
        public dni: string,
        public nombre: string,
        public telefono: number,
        public direccion: string,
        public pass: string,
        public activo: boolean
    ){}
}
