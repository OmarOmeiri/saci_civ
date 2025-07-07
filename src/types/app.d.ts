
type SACIData = {
  id: string;
  date: Date;
  acft: string;
  crew: string;
  studentCanac: string;
  dep: string;
  arr: string;
  tTotal: number;
  tDay: number;
  tNight: number;
  tNav: number;
  tIFR: number;
  tCapt: number;
  ldg: number;
  NM: number;
  func: string;
  obs: string;
  status: string;
  reg: string;
  exclusionDate: string;
  excludedBy: string;
}

type CIVTotal = {
  ldg: number,
  mnte: number,
  mlte: number,
  typ: number,
  instr: number,
  nav: number,
  diu: number,
  not: number,
  ifr: number,
  cpt: number,
  dc: number,
  cmd: number,
  cpl: number,
  total: number
}

type CIVTotals = {
  current: CIVTotal,
  last: CIVTotal,
}

type ACFTTypes = {
  reg: string;
  tp: string;
  tpc: string;
}