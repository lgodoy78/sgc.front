export interface Empresa {
  rutEmpresa: number;
  dvRutEmpresa: string;
  razonSocial: string;
  nombreFantasia: string;
  paginaWeb: string;
  email: string;
  dirCallle: string;
  dirNumero: number | null;
  dirPiso: number | null;
  dirOficina: number | null;
  codComuna: string | null;
  codRegion: string | null;
  codPais: string | null;
  descActividad: string ;
  codActividadSiiPri: string | null;
  codActividadSiiSec: string | null;
  aplicaCmf: string;
  codigoCmf: string;
  codActividadCmf: string | null;
  codSectorFinanCmf: number | null;
  codCompInstitucionalCmf: number | null;
  logo: string;
  actions: string;
}
