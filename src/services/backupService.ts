import { db } from '../db';

export async function exportAllDataAsJSON() {
  const receipts = await db.receipts.toArray();
  const collages = await db.collages.toArray();

  const backupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    receipts,
    collages,
  };

  const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `scrapbook-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importDataFromJSON(file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (Array.isArray(data.receipts)) {
          for (const item of data.receipts) {
            delete item.id;
            await db.receipts.add(item);
          }
        }

        if (Array.isArray(data.collages)) {
          for (const col of data.collages) {
            delete col.id;
            await db.collages.add(col);
          }
        }

        resolve();
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
