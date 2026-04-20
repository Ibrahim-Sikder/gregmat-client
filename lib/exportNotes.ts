import * as XLSX from "xlsx";

export function exportNotesToExcel(notes?: Record<string, string>, data?: any) {
  const notesData = Object.entries(notes || {}).map(([word, note]) => ({
    word,
    note,
  }));

  const worksheet = XLSX.utils.json_to_sheet(notesData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Notes");
  XLSX.writeFile(workbook, "mountain-notes.xlsx");
}
