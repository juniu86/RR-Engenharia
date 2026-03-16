export interface DadosCliente {
  razao_social: string;
  cnpj: string;
  endereco: string;
}

export interface DadosProposta {
  numero: string;
  cliente: DadosCliente;
  escopo: string;
  valor: number;
  condicoes_pagamento: string;
  data_emissao: Date;
}
