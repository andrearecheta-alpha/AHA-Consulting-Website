/** Google Apps Script — Contact form receiver
  * Spreadsheet: "Operational Excellence Survey — Responses"
  * Tab (Sheet): "Contacts_Want_Updates"
  *
  * How to use:
  * 1) Open the Google Sheet (or create it) and make sure the tab exists.
  * 2) Extensions → Apps Script → paste this code.
  *    - If this project is BOUND to the Sheet, you can leave SPREADSHEET_ID empty.
  *    - If it's UNBOUND, paste the spreadsheet ID below.
  * 3) Deploy → New deployment → Type: Web app
  *    - Execute as: Me
  *    - Who has access: Anyone
  * 4) Copy the "Web app" URL and paste it into script.js (ENDPOINT).
  */

const SPREADSHEET_NAME = 'Operational Excellence Survey — Responses';
const SHEET_NAME = 'Contacts_Want_Updates';
// Optional: paste your spreadsheet ID here if the script is NOT bound to the Sheet.
const SPREADSHEET_ID = '';

function _getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  // If bound to the sheet, this returns the correct file.
  return SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const ss = _getSpreadsheet_();

    // Try by name first to be explicit; fallback to active if not found.
    let target = ss;
    if (ss.getName && ss.getName() !== SPREADSHEET_NAME) {
      // If the active file name doesn't match, attempt to open by name (for bound cases, this is usually unnecessary).
      // Note: openByName does not exist, so we rely on being in the correct file OR SPREADSHEET_ID being filled.
      // Keeping this logic simple and predictable.
    }

    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // Ensure header exists (run once)
    const header = ['Timestamp','Name','Email','Company','Role','Message','Page','UserAgent'];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(header);
    } else {
      // If first row isn't the header, optionally check and set (non-destructive)
      const firstRow = sheet.getRange(1,1,1,header.length).getValues()[0];
      const needsHeader = firstRow.join('') === '' || firstRow[0] !== 'Timestamp';
      if (needsHeader) {
        sheet.insertRowBefore(1);
        sheet.getRange(1,1,1,header.length).setValues([header]);
      }
    }

    const row = [
      new Date(),
      params.name || '',
      params.email || '',
      params.company || '',
      params.role || '',
      params.message || '',
      params.page || '',
      params.userAgent || ''
    ];
    sheet.appendRow(row);

    const output = ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
    return output;
  } catch (err) {
    const output = ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
    return output;
  }
}
