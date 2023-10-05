import fs from 'fs';
import cheerio from 'cheerio';

export function getSelectValue() {
  const ejs = fs.readFileSync('views/index.ejs', 'utf-8');
  const $ = cheerio.load(ejs);

  const selectedValue = $('#select1').val();

  return selectedValue;
}