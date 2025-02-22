export interface Sucursal {
    rutEmpresa: number;
    codSucursal: string;
    sucursal: string;
    dirCallle: string;
    dirNumero: number | null; 
    dirPiso: number | null;
    dirOficina: number | null;
    codComuna: string | null;
    codRegion: string | null;
    codPais: string | null;
    actions:string;
  }