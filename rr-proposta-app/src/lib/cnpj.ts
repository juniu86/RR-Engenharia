import { cleanCNPJ, formatCNPJ } from './format';
import type { DadosCliente } from '../types';

interface BrasilAPICNPJ {
  razao_social: string;
  cnpj: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export async function buscarCNPJ(cnpj: string): Promise<DadosCliente> {
  const digits = cleanCNPJ(cnpj);

  if (digits.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }

  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('CNPJ não encontrado na base da Receita Federal');
    }
    throw new Error('Erro ao consultar CNPJ. Tente novamente.');
  }

  const data: BrasilAPICNPJ = await response.json();

  const enderecoPartes = [
    data.logradouro,
    data.numero,
    data.complemento,
    data.bairro,
    `${data.municipio}/${data.uf}`,
    `CEP ${data.cep}`,
  ].filter(Boolean);

  return {
    razao_social: data.razao_social,
    cnpj: formatCNPJ(digits),
    endereco: enderecoPartes.join(', '),
  };
}
