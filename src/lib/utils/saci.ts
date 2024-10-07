import dayjs from 'dayjs';
import uniqid from 'uniqid';
import { COLMAP_INDEX } from '../consts/saci';
import { csvToArray } from './csv';
import { strIsDate } from './date';

export const saciTimeToDecimal = (str: string) => {
  const [h, m] = str.split(':').map(Number);
  if (m < 4) return h;
  if (m >= 4 && m <= 9) return h + 0.1;
  if (m >= 10 && m <= 15) return h + 0.2;
  if (m >= 16 && m <= 21) return h + 0.3;
  if (m >= 22 && m <= 27) return h + 0.4;
  if (m >= 28 && m <= 33) return h + 0.5;
  if (m >= 34 && m <= 39) return h + 0.6;
  if (m >= 40 && m <= 45) return h + 0.7;
  if (m >= 46 && m <= 51) return h + 0.8;
  if (m >= 52 && m <= 57) return h + 0.9;
  return h + 1;
};

const getCanacSaci = (str: string) => {
  try {
    // @ts-expect-error returns empty string if not found
    const [canac] = /\d+/.exec(str);
    return canac.replace(/\(|\)/g, '').trim();
  } catch {
    return '';
  }
};

const filterSaciData = (data: string[][]) => (
  data.filter((d) => (
    strIsDate(d[COLMAP_INDEX.saci.date], 'D/M/YYYY') && !d[COLMAP_INDEX.saci.status].toLowerCase().includes('exclusão')
  ))
);

const saciCSVToData = async (saci: string): Promise<string[][]> => {
  const arr = await csvToArray(saci);
  arr.shift();
  return filterSaciData(arr);
};

const saciXLTToData = async (saci: string): Promise<string[][]> => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(saci, 'text/xml');
  const data: string[][] = [];
  Array.from(xmlDoc.getElementsByTagName('tr'))
    .forEach((row, i) => {
      if (!i) {
        return;
      }
      data.push(Array.from(row.children).map((c) => c.innerHTML));
    });

  return filterSaciData(data);
};

function toJson(data: string[][]): SACIData[] {
  return data.map((d) => ({
    id: uniqid(),
    date: dayjs(d[COLMAP_INDEX.saci.date], 'D/M/YYYY').toDate(),
    acft: d[COLMAP_INDEX.saci.acft],
    crew: d[COLMAP_INDEX.saci.crew],
    studentCanac: getCanacSaci(d[COLMAP_INDEX.saci.crew]),
    dep: d[COLMAP_INDEX.saci.dep],
    arr: d[COLMAP_INDEX.saci.arr],
    tTotal: saciTimeToDecimal(d[COLMAP_INDEX.saci.tDay]) + saciTimeToDecimal(d[COLMAP_INDEX.saci.tNight]),
    tDay: saciTimeToDecimal(d[COLMAP_INDEX.saci.tDay]),
    tNight: saciTimeToDecimal(d[COLMAP_INDEX.saci.tNight]),
    tNav: saciTimeToDecimal(d[COLMAP_INDEX.saci.tNav]),
    tIFR: saciTimeToDecimal(d[COLMAP_INDEX.saci.tIFR]),
    tCapt: saciTimeToDecimal(d[COLMAP_INDEX.saci.tCapt]),
    ldg: Number(d[COLMAP_INDEX.saci.ldg]),
    NM: Number(d[COLMAP_INDEX.saci.NM].replace(',', '.').trim()),
    func: d[COLMAP_INDEX.saci.func].trim(),
    obs: d[COLMAP_INDEX.saci.obs].trim(),
    status: d[COLMAP_INDEX.saci.status].trim(),
    reg: d[COLMAP_INDEX.saci.reg].trim(),
    exclusionDate: d[COLMAP_INDEX.saci.exclusionDate].trim(),
    excludedBy: d[COLMAP_INDEX.saci.excludedBy].trim(),
  }));
}

export const saciToData = async (file: File): Promise<SACIData[]> => {
  const decoded = new TextDecoder('iso-8859-1').decode(await file.arrayBuffer());
  if (!file.name.endsWith('.xlt')) return toJson(await saciCSVToData(decoded));
  return toJson(await saciXLTToData(decoded)).sort((a, b) => a.date.getTime() - b.date.getTime());
};
