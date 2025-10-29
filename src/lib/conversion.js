export function toNumber(x){ if(x==null) return 0; const n=Number(String(x).replace(',','.')); return Number.isFinite(n)?n:0 }
export function calcNubank(cny, rate, iof){ const sem=cny*rate; const iofV=+(sem*(iof/100)).toFixed(2); const total=+(sem+iofV).toFixed(2); return {semIof:sem, iofV, total} }
export function calcWise(cny, rate){ return +(cny*rate).toFixed(2) }
export function formatBRL(v){ return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(v||0) }
