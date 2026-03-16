export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// Converte número para valor por extenso em português
export function valorPorExtenso(valor: number): string {
  if (valor === 0) return 'zero reais';

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  function grupo(n: number): string {
    if (n === 0) return '';
    if (n === 100) return 'cem';

    const c = Math.floor(n / 100);
    const resto = n % 100;
    const d = Math.floor(resto / 10);
    const u = resto % 10;

    const partes: string[] = [];

    if (c > 0) partes.push(centenas[c]);

    if (resto >= 10 && resto < 20) {
      partes.push(especiais[resto - 10]);
    } else {
      if (d > 0) partes.push(dezenas[d]);
      if (u > 0) partes.push(unidades[u]);
    }

    return partes.join(' e ');
  }

  const inteiro = Math.floor(Math.abs(valor));
  const centavos = Math.round((Math.abs(valor) - inteiro) * 100);

  const bilhoes = Math.floor(inteiro / 1_000_000_000);
  const milhoes = Math.floor((inteiro % 1_000_000_000) / 1_000_000);
  const milhares = Math.floor((inteiro % 1_000_000) / 1_000);
  const unid = inteiro % 1_000;

  const partes: string[] = [];

  if (bilhoes > 0) {
    partes.push(grupo(bilhoes) + (bilhoes === 1 ? ' bilhão' : ' bilhões'));
  }
  if (milhoes > 0) {
    partes.push(grupo(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões'));
  }
  if (milhares > 0) {
    partes.push(grupo(milhares) + ' mil');
  }
  if (unid > 0) {
    partes.push(grupo(unid));
  }

  let resultado = partes.join(', ');

  // Adicionar "e" antes da última parte se houver mais de uma
  const lastComma = resultado.lastIndexOf(', ');
  if (lastComma > 0 && !resultado.substring(lastComma + 2).includes(' e ')) {
    resultado = resultado.substring(0, lastComma) + ' e ' + resultado.substring(lastComma + 2);
  }

  resultado += inteiro === 1 ? ' real' : ' reais';

  if (centavos > 0) {
    resultado += ' e ' + grupo(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
  }

  return resultado;
}

export function formatCNPJ(cnpj: string): string {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return cnpj;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
}

export function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}
