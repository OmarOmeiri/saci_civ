import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import styles from './SaciCiv.module.css';
import { getCivPageTotals, sumCivTotals } from '../utils/civ';

export default function CivPages({
  closedPages,
  onClosedPageDelete,
}: {
  closedPages: Record<number, SACIData[]>
  onClosedPageDelete: (pg: number) => void
}) {
  const keys = Object.keys(closedPages);
  const [totals, setTotals] = useState<CIVTotals>({
    last: {
    ldg: 0,
    nav: 0,
    diu: 0,
    not: 0,
    ifr: 0,
    cpt: 0,
    dc: 0,
    cmd: 0,
    cpl: 0,
    total: 0,
  },
    current: {
    ldg: 0,
    nav: 0,
    diu: 0,
    not: 0,
    ifr: 0,
    cpt: 0,
    dc: 0,
    cmd: 0,
    cpl: 0,
    total: 0,
  }});

  useEffect(() => {
    setTotals(sumCivTotals(...Object.values(closedPages).map(getCivPageTotals)));
  }, [closedPages]);

  if (!keys.length || !Object.keys(totals).length) return null;

  return (
    <div className={styles.ClosedPagesContainer}>
      <h1 style={{ fontSize: '2rem' }}>Páginas Fechadas</h1>
      <hr style={{ padding: '1rem 0' }} />
      <div className={styles.CivPagesContainer}>
        <div style={{ width: '140px' }}>
          {
            keys
              .map((cp, i) => (
                <div key={cp} style={{ display: 'flex', gap: '5px' }}>
                  <div>{`Página ${cp}`}</div>
                  {
                    i === keys.length - 1
                      ? <button onClick={() => onClosedPageDelete(Number(cp))}><Trash2 size={18} /></button>
                      : null
                  }
                </div>
              ))
          }
        </div>

        <div className={styles.TotalsContainer}>
          <div className={styles.TotalsGridContainer}>
            <div>LDG</div>
            <div>NAV</div>
            <div>DIU</div>
            <div>NOT</div>
            <div>IFR</div>
            <div>CPT</div>
            <div>DC</div>
            <div>CMD</div>
            <div>CPL</div>
            <div>TOT</div>
            <div>{totals.last.ldg}</div>
            <div>{totals.last.nav.toFixed(1)}</div>
            <div>{totals.last.diu.toFixed(1)}</div>
            <div>{totals.last.not.toFixed(1)}</div>
            <div>{totals.last.ifr.toFixed(1)}</div>
            <div>{totals.last.cpt.toFixed(1)}</div>
            <div>{totals.last.dc.toFixed(1)}</div>
            <div>{totals.last.cmd.toFixed(1)}</div>
            <div>{totals.last.cpl.toFixed(1)}</div>
            <div>{totals.last.total.toFixed(1)}</div>
            <div>{totals.current.ldg}</div>
            <div>{totals.current.nav.toFixed(1)}</div>
            <div>{totals.current.diu.toFixed(1)}</div>
            <div>{totals.current.not.toFixed(1)}</div>
            <div>{totals.current.ifr.toFixed(1)}</div>
            <div>{totals.current.cpt.toFixed(1)}</div>
            <div>{totals.current.dc.toFixed(1)}</div>
            <div>{totals.current.cmd.toFixed(1)}</div>
            <div>{totals.current.cpl.toFixed(1)}</div>
            <div>{totals.current.total.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
