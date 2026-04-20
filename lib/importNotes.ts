import * as XLSX from "xlsx";

export function importNotesFromExcel(
  file: File
): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<{ word: string; note: string }>(
        sheet
      );

      const notes: Record<string, string> = {};
      json.forEach((row) => {
        if (row.word && row.note) {
          notes[row.word] = row.note;
        }
      });

      resolve(notes);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
