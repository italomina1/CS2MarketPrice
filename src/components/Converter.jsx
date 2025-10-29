import { useMemo, useState } from 'react'
import { Save, Trash2, Download, History } from 'lucide-react'
import { toNumber, calcNubank, calcWise, formatBRL } from '../lib/conversion'

const STORAGE_KEY = 'cs2mp-history'

export default function Converter(){
  const [store,setStore] = useState(localStorage.getItem(STORAGE_KEY))
  const [nome, setNome] = useState('')
  const [loja, setLoja] = useState('')
  const [cny, setCny] = useState('100')
  const [nubRate, setNubRate] = useState('0.7895')
  const [iof, setIof] = useState('3.5')
  const [wiseRate, setWiseRate] = useState('0.7897')
  const [markup, setMarkup] = useState('15')
  const [fonte, setFonte] = useState('NUBANK')

  const hist = useMemo(()=>{ try{ return store?JSON.parse(store):[] }catch{return []} },[store])

  const cnyN = toNumber(cny), nubRateN=toNumber(nubRate), wiseRateN=toNumber(wiseRate), iofN=toNumber(iof), markupN=toNumber(markup)
  const nub = calcNubank(cnyN, nubRateN, iofN)
  const wis = calcWise(cnyN, wiseRateN)
  const base = fonte==='NUBANK'? nub.total : wis
  const precoFinal = +(base * (1+markupN/100)).toFixed(2)
  const lucroReais = +(precoFinal - base).toFixed(2)

  function onSalvar(){
    const row = { ts:new Date().toISOString(), loja, item:nome, cny:cnyN,
      nubank_sem_iof:+nub.semIof.toFixed(2), nubank_iof:+nub.iofV.toFixed(2), nubank_total:+nub.total.toFixed(2),
      wise_total:+wis.toFixed(2), fonte_preco:fonte, markup_percent:markupN, preco_final:precoFinal, lucro_reais:lucroReais }
    const newHist = [row, ...(hist||[])].slice(0,1000)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHist))
    setStore(JSON.stringify(newHist))
  }
  function onLimpar(){ if(confirm('Limpar histórico local?')){ localStorage.removeItem(STORAGE_KEY); setStore(null) } }
  function onExport(){
    const headers = ['data_hora','loja','item','valor_cny','nubank_sem_iof','nubank_iof','nubank_total','wise_total','fonte_preco','markup_percent','preco_final','lucro_reais']
    const lines = [headers.join(';')]
    ;(hist||[]).forEach(r=>{
      lines.push([r.ts,r.loja||'',r.item||'',r.cny,r.nubank_sem_iof,r.nubank_iof,r.nubank_total,r.wise_total,r.fonte_preco,r.markup_percent,r.preco_final,r.lucro_reais].join(';'))
    })
    const blob = new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8;'})
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='CS2MarketPrice_Historico.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="grid gap-6">
      <section className="card grid md:grid-cols-2 gap-6 items-center">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="CS2MarketPrice" className="w-20 h-20 rounded-lg ring-1 ring-bronze/40" />
          <div>
            <h1 className="text-2xl font-display font-bold">CS2MarketPrice</h1>
            <p className="text-sm opacity-80">Conversor e precificador de skins (CNY/USD → BRL)</p>
          </div>
        </div>
        <div className="text-right md:text-right"><span className="text-bronze">v0.1</span></div>
      </section>

      <section className="card grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div><label className="text-sm opacity-80">Loja/Vendedor</label>
          <input value={loja} onChange={e=>setLoja(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2" placeholder="Ex.: BUFF/CSFloat"/></div>
        <div className="sm:col-span-2"><label className="text-sm opacity-80">Nome da Skin</label>
          <input value={nome} onChange={e=>setNome(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2" placeholder="AK Redline (FT)"/></div>
        <div><label className="text-sm opacity-80">Valor em CNY</label>
          <input value={cny} onChange={e=>setCny(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2" /></div>
        <div><label className="text-sm opacity-80">Taxa Nubank (BRL/CNY)</label>
          <input value={nubRate} onChange={e=>setNubRate(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2" /></div>
        <div><label className="text-sm opacity-80">IOF Nubank (%)</label>
          <input value={iof} onChange={e=>setIof(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2" /></div>
        <div><label className="text-sm opacity-80">Taxa Wise (BRL/CNY)</label>
          <input value={wiseRate} onChange={e=>setWiseRate(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2" /></div>
        <div><label className="text-sm opacity-80">Markup (lucro %)</label>
          <input value={markup} onChange={e=>setMarkup(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2" /></div>
        <div><label className="text-sm opacity-80">Fonte para precificar</label>
          <select value={fonte} onChange={e=>setFonte(e.target.value)} className="w-full mt-1 bg-night border border-slate rounded-lg px-3 py-2">
            <option value="NUBANK">Nubank (com IOF)</option>
            <option value="WISE">Wise</option>
          </select></div>
      </section>

      <section className="card grid gap-3">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-night/60 rounded-lg p-4 border border-slate">
            <div className="opacity-70">Nubank</div>
            <div className="mt-1">Sem IOF: <b>{formatBRL(nub.semIof)}</b></div>
            <div>IOF: <b>{formatBRL(nub.iofV)}</b></div>
            <div>Total: <b className="text-bronze">{formatBRL(nub.total)}</b></div>
          </div>
          <div className="bg-night/60 rounded-lg p-4 border border-slate">
            <div className="opacity-70">Wise</div>
            <div>Total: <b className="text-bronze">{formatBRL(wis)}</b></div>
          </div>
          <div className="bg-night/60 rounded-lg p-4 border border-slate">
            <div className="opacity-70">Preço final</div>
            <div className="text-2xl font-display font-bold">{formatBRL(precoFinal)}</div>
            <div className="opacity-80">Lucro: <span className="text-emerald-400 font-semibold">{formatBRL(lucroReais)}</span></div>
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <button className="btn btn-primary inline-flex items-center gap-2" onClick={onSalvar}><Save size={18}/>Salvar registro</button>
          <button className="btn btn-secondary inline-flex items-center gap-2" onClick={onExport}><Download size={18}/>Exportar CSV</button>
          <button className="btn inline-flex items-center gap-2" onClick={onLimpar}><Trash2 size={18}/>Limpar histórico</button>
        </div>
      </section>

      <section className="card">
        <div className="flex items-center gap-2 mb-3"><History size={18}/> <b>Histórico recente</b></div>
        {(!hist || hist.length===0) ? <div className="opacity-70 text-sm">Sem registros ainda.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left opacity-70">
                <tr><th className="py-2">Data</th><th>Loja</th><th>Item</th><th className="text-right">CNY</th><th className="text-right">Base</th><th className="text-right">Preço final</th><th className="text-right">Lucro</th></tr>
              </thead>
              <tbody>
                {hist.map((r,i)=>{
                  const base = r.fonte_preco==='NUBANK'? r.nubank_total : r.wise_total
                  return (
                    <tr key={i} className="border-t border-slate/40">
                      <td className="py-2">{new Date(r.ts).toLocaleString('pt-BR')}</td>
                      <td>{r.loja}</td>
                      <td className="truncate max-w-[260px]" title={r.item}>{r.item}</td>
                      <td className="text-right">{r.cny}</td>
                      <td className="text-right">{formatBRL(base)}</td>
                      <td className="text-right">{formatBRL(r.preco_final)}</td>
                      <td className="text-right text-emerald-400">{formatBRL(r.lucro_reais)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
