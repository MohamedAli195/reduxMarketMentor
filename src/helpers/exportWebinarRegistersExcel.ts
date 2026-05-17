import * as XLSX from 'xlsx';
import type { ColInfo } from 'xlsx';

export interface IWebinarRegisterRow {
  id: number;
  name: string;
  email: string;
  phone: string;
}

const MIN_WCH = { id: 14, name: 28, email: 36, phone: 22 } as const;
const MAX_WCH = 55;

function columnWidthsFromSheet(
  rows: IWebinarRegisterRow[],
  columnLabels: { id: string; name: string; email: string; phone: string },
): ColInfo[] {
  const cells: string[][] = [
    [columnLabels.id, columnLabels.name, columnLabels.email, columnLabels.phone],
    ...rows.map((r) => [String(r.id), r.name ?? '', r.email ?? '', r.phone ?? '']),
  ];
  const keys: (keyof typeof MIN_WCH)[] = ['id', 'name', 'email', 'phone'];
  return keys.map((key, colIndex) => {
    let maxLen: number = MIN_WCH[key];
    for (const row of cells) {
      const len = (row[colIndex] ?? '').length;
      if (len > maxLen) maxLen = len;
    }
    return { wch: Math.min(maxLen + 3, MAX_WCH) };
  });
}

/** Writes a real .xlsx file with column widths so Excel opens with readable columns. */
export function downloadWebinarRegistersExcel(
  rows: IWebinarRegisterRow[],
  columnLabels: { id: string; name: string; email: string; phone: string },
  filenameBase = 'webinar-registrations',
): void {
  const headerRow = [columnLabels.id, columnLabels.name, columnLabels.email, columnLabels.phone];
  const dataRows = rows.map((r) => [r.id, r.name, r.email, r.phone]);
  const aoa: (string | number)[][] = [headerRow, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = columnWidthsFromSheet(rows, columnLabels);

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Webinar');

  const date = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${filenameBase}-${date}.xlsx`);
}
