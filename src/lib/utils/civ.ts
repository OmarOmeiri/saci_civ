function removeDiacritics(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const getCivPageTotal = (page: SACIData[], key: KeysMatching<SACIData, number>) => (
  page.reduce((a, b) => a + b[key], 0)
);

const getCivPageTotalByType = (page: SACIData[], typeData: ACFTTypes[] | null) => {
  if (!typeData) return { mnte: 0, mlte: 0, typ: 0 };
  return page.reduce((t, d) => {
    const found = typeData.find((td) => td.reg.trim().toLowerCase() === d.acft.trim().toLowerCase());
    if (!found) throw new Error(`Não foi possivel definir o tipo da aeronave ${d.acft}`);
    if (found.tp.toLowerCase().trim() === 'mnte') t.mnte += d.tTotal;
    else if (found.tp.toLowerCase().trim() === 'mlte') t.mlte += d.tTotal;
    else t.typ += d.tTotal;
    return t;
  }, { mnte: 0, mlte: 0, typ: 0 });
};

const getTimeType = (page: SACIData[]): {dc: number, cmd: number, cpl: number, instr: number} => (
  page.reduce((t, v) => {
    const func = removeDiacritics(v.func.trim().toLowerCase());
    if (
      func === 'piloto em comando'
      || func === 'instrutor voo'
      || func === 'piloto em instrucao solo'
    ) {
      t.cmd += v.tTotal;
    } else if (
      func.includes('observador')
      || func === 'piloto em instrucao'
    ) {
      t.dc += v.tTotal;
    } else if (func.includes('co-piloto')) {
      t.cpl += v.tTotal;
    }

    if (
      func === 'instrutor voo'
      || func.includes('observador')
    ) {
      t.instr += v.tTotal;
    }

    return t;
  }, {
    dc: 0,
    cmd: 0,
    cpl: 0,
    instr: 0,
  })
);

export const getCivPageTotals = (page: SACIData[], typeData: ACFTTypes[] | null): CIVTotal => {
  const diu = getCivPageTotal(page, 'tDay');
  const not = getCivPageTotal(page, 'tNight');
  return {
    ldg: getCivPageTotal(page, 'ldg'),
    ...getCivPageTotalByType(page, typeData),
    nav: getCivPageTotal(page, 'tNav'),
    diu,
    not,
    ifr: getCivPageTotal(page, 'tIFR'),
    cpt: getCivPageTotal(page, 'tCapt'),
    total: diu + not,
    ...getTimeType(page),
  };
};

export const sumCivTotals = (...pages: CIVTotal[]): {
    current: CIVTotal;
    last: CIVTotal;
 } => {
  const totalsCurrent = pages.reduce((tot, pg) => ({
    ldg: (tot.ldg || 0) + pg.ldg,
    mnte: (tot.mnte || 0) + pg.mnte,
    mlte: (tot.mlte || 0) + pg.mlte,
    typ: (tot.typ || 0) + pg.typ,
    instr: (tot.instr || 0) + pg.instr,
    nav: (tot.nav || 0) + pg.nav,
    diu: (tot.diu || 0) + pg.diu,
    not: (tot.not || 0) + pg.not,
    ifr: (tot.ifr || 0) + pg.ifr,
    cpt: (tot.cpt || 0) + pg.cpt,
    dc: (tot.dc || 0) + pg.dc,
    cmd: (tot.cmd || 0) + pg.cmd,
    cpl: (tot.cpl || 0) + pg.cpl,
    total: (tot.total || 0) + pg.total,
  }), {
    ldg: 0,
    mnte: 0,
    mlte: 0,
    typ: 0,
    instr: 0,
    nav: 0,
    diu: 0,
    not: 0,
    ifr: 0,
    cpt: 0,
    dc: 0,
    cmd: 0,
    cpl: 0,
    total: 0,
  } as CIVTotals['current']);

  const totalsLast = {
    ldg: totalsCurrent.ldg - (pages[pages.length - 1]?.ldg || 0),
    mnte: totalsCurrent.mnte - (pages[pages.length - 1]?.mnte || 0),
    mlte: totalsCurrent.mlte - (pages[pages.length - 1]?.mlte || 0),
    typ: totalsCurrent.typ - (pages[pages.length - 1]?.typ || 0),
    instr: totalsCurrent.instr - (pages[pages.length - 1]?.instr || 0),
    nav: totalsCurrent.nav - (pages[pages.length - 1]?.nav || 0),
    diu: totalsCurrent.diu - (pages[pages.length - 1]?.diu || 0),
    not: totalsCurrent.not - (pages[pages.length - 1]?.not || 0),
    ifr: totalsCurrent.ifr - (pages[pages.length - 1]?.ifr || 0),
    cpt: totalsCurrent.cpt - (pages[pages.length - 1]?.cpt || 0),
    dc: totalsCurrent.dc - (pages[pages.length - 1]?.dc || 0),
    cmd: totalsCurrent.cmd - (pages[pages.length - 1]?.cmd || 0),
    cpl: totalsCurrent.cpl - (pages[pages.length - 1]?.cpl || 0),
    total: totalsCurrent.total - (pages[pages.length - 1]?.total || 0),
  };

  return {
    current: totalsCurrent,
    last: totalsLast,
  };
};
