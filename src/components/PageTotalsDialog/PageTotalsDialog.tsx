import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMemo } from 'react';
import { getCivPageTotals } from '../../lib/utils/civ';
import styles from './PageTotals.module.css';
import { useOnKeyPress } from '../../hooks/onKeyDown';

export default function PageTotalsDialog({
  closedPage,
  setClosedPage,
}: {
  closedPage: SACIData[] | null
  setClosedPage: React.Dispatch<React.SetStateAction<SACIData[] | null>>
}) {
  const totals = useMemo(() => (
    closedPage
      ? getCivPageTotals(closedPage)
      : null
  ), [closedPage]);

  useOnKeyPress((e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setClosedPage(null);
    }
  });
  return (
    <AlertDialog open={!!closedPage}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Totais da página</AlertDialogTitle>
          <hr/>
          {
            totals
              ? (
                <div className={styles.TotalsContainer}>
                  <div className={styles.TotalsGridContainer}>
                    <div>LDG</div>
                    <div>{totals.ldg}</div>
                    <div>NAV</div>
                    <div>{totals.nav.toFixed(1)}</div>
                    <div>DIU</div>
                    <div>{totals.diu.toFixed(1)}</div>
                    <div>NOT</div>
                    <div>{totals.not.toFixed(1)}</div>
                    <div>IFR</div>
                    <div>{totals.ifr.toFixed(1)}</div>
                    <div>CPT</div>
                    <div>{totals.cpt.toFixed(1)}</div>
                    <div>DC</div>
                    <div>{totals.dc.toFixed(1)}</div>
                    <div>CMD</div>
                    <div>{totals.cmd.toFixed(1)}</div>
                    <div>CPL</div>
                    <div>{totals.cpl.toFixed(1)}</div>
                    <div>TOT</div>
                    <div>{totals.total.toFixed(1)}</div>
                  </div>
                </div>
              )
              : null
          }
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setClosedPage(null)}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
