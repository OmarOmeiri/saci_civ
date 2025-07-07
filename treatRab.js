import { readFile, writeFile } from 'fs/promises';

(async () => {
  const rab = JSON.parse((await readFile('./rab.json')).toString());
  const rabClean = [];
  for (const item of rab) {
    rabClean.push({
      reg: item.MARCA,
      tp: item.CDTIPO,
      tpc: item.CDTIPOICAO,
    });
  }
  await writeFile('./rabClean.json', JSON.stringify(rabClean));
})();
