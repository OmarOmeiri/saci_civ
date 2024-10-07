const getCivPageTotal = (page: SACIData[], key: KeysMatching<SACIData, number>) => (
  page.reduce((a, b) => a + b[key], 0)
);

const getTimeType = (page: SACIData[]): {dc: number, cmd: number, cpl: number} => (
  page.reduce((t, v) => {
    const func = v.func.trim().toLowerCase();
    if (
      func === 'piloto em comando'
      || func.includes('solo')
    ) {
      t.cmd += v.tTotal;
    } else if (
      func.includes('instrutor')
      || func.includes('instrução')
    ) {
      t.dc += v.tTotal;
    } else if (func.includes('co-piloto')) {
      t.cpl += v.tTotal;
    }

    return t;
  }, { dc: 0, cmd: 0, cpl: 0 })
);

export const getCivPageTotals = (page: SACIData[]): CIVTotals => {
  const diu = getCivPageTotal(page, 'tDay');
  const not = getCivPageTotal(page, 'tNight');
  return {
    ldg: getCivPageTotal(page, 'ldg'),
    nav: getCivPageTotal(page, 'tNav'),
    diu,
    not,
    ifr: getCivPageTotal(page, 'tIFR'),
    cpt: getCivPageTotal(page, 'tCapt'),
    total: diu + not,
    ...getTimeType(page),
  };
};

export const sumCivTotals = (...pages: CIVTotals[]) => (
  pages.reduce((tot, pg) => ({
    ldg: (tot.ldg || 0) + pg.ldg,
    nav: (tot.nav || 0) + pg.nav,
    diu: (tot.diu || 0) + pg.diu,
    not: (tot.not || 0) + pg.not,
    ifr: (tot.ifr || 0) + pg.ifr,
    cpt: (tot.cpt || 0) + pg.cpt,
    dc: (tot.dc || 0) + pg.dc,
    cmd: (tot.cmd || 0) + pg.cmd,
    cpl: (tot.cpl || 0) + pg.cpl,
    total: (tot.total || 0) + pg.total,
  }), {} as CIVTotals)
);
