export function formatDateUTCToJST(dateString: string): string {
  const date = new Date(dateString);

  // タイムゾーンを日本時間（JST, UTC+9）に設定
  date.setHours(date.getHours() + 9);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}

export function formatDateToJST(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
}
