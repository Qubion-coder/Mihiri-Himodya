// ===================================================================================
// WEDDING RSVP & WISHES - GOOGLE APPS SCRIPT
// Mihiri & Himodya Wedding
// ===================================================================================

// If you created this script via Extensions > Apps Script inside your Google Sheet,
// you can leave SPREADSHEET_ID empty and it will automatically use the active sheet!
// Or paste your Google Sheet ID below:
const SPREADSHEET_ID = '';

// Sheet configurations and header definitions
const CONFIG = {
  RSVP: {
    sheetName: 'RSVP',
    headers: ['Timestamp', 'Full Name', 'Side', 'Guests', 'Dietary Notes']
  },
  WISH: {
    sheetName: 'WISH',
    headers: ['Timestamp', 'Name', 'Message']
  }
};

/**
 * Run this function once from the Apps Script editor to create 
 * both sheets ('RSVP' and 'WISH') with their headers formatted nicely!
 */
function setupSheets() {
  const ss = getSpreadsheet_();
  
  // Setup RSVP sheet
  setupSingleSheet_(ss, CONFIG.RSVP.sheetName, CONFIG.RSVP.headers);
  
  // Setup WISH sheet
  setupSingleSheet_(ss, CONFIG.WISH.sheetName, CONFIG.WISH.headers);
  
  // Delete default 'Sheet1' if both custom sheets exist
  try {
    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1) {
      ss.deleteSheet(defaultSheet);
    }
  } catch (e) {
    // Ignore if Sheet1 doesn't exist or is only sheet
  }
  
  Logger.log('RSVP and WISH sheets created and formatted successfully!');
}

/**
 * Handles incoming POST requests from the website
 */
function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheetKey = String(payload.sheet || '').toUpperCase().trim();

    if (sheetKey !== 'RSVP' && sheetKey !== 'WISH') {
      return jsonResponse_({ ok: false, error: 'Invalid sheet parameter. Use RSVP or WISH.' });
    }

    const ss = getSpreadsheet_();
    const targetConfig = CONFIG[sheetKey];
    const sheet = getOrCreateSheet_(ss, targetConfig.sheetName, targetConfig.headers);

    const timestamp = new Date();

    if (sheetKey === 'RSVP') {
      const fullName = payload.fullName || payload.name || '';
      const side = payload.side || payload.guestSide || '';
      const guests = payload.guests || '1';
      const dietaryNotes = payload.dietaryNotes || '';

      sheet.appendRow([timestamp, fullName, side, guests, dietaryNotes]);
    } else {
      const name = payload.name || payload.fullName || '';
      const message = payload.message || '';

      sheet.appendRow([timestamp, name, message]);
    }

    return jsonResponse_({ ok: true, message: 'Saved successfully to ' + sheetKey });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      error: String(error && error.message ? error.message : error)
    });
  }
}

/**
 * Handles GET requests to verify the endpoint status
 */
function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Wedding RSVP & Wishes API is online and running.'
  });
}

/**
 * Retrieves the spreadsheet (either by ID or Active Spreadsheet)
 */
function getSpreadsheet_() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== '') {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  throw new Error('No active spreadsheet found. Please specify SPREADSHEET_ID at the top of the script.');
}

/**
 * Gets an existing sheet or creates a new one with formatted headers
 */
function getOrCreateSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  ensureHeaders_(sheet, headers);
  return sheet;
}

/**
 * Creates and formats a single sheet with frozen header row and background styling
 */
function setupSingleSheet_(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  ensureHeaders_(sheet, headers);
}

/**
 * Adds headers and applies styling if sheet is newly created or empty
 */
function ensureHeaders_(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#020035');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');
    sheet.setFrozenRows(1);

    // Auto fit column widths nicely
    for (let col = 1; col <= headers.length; col++) {
      sheet.autoResizeColumn(col);
    }
  }
}

/**
 * Parses request payload from JSON, form-data, or urlencoded query string
 */
function parsePayload_(e) {
  if (!e) return {};

  const params = e.parameter ? e.parameter : {};
  if (Object.keys(params).length > 0) {
    return params;
  }

  const contents = e.postData && e.postData.contents ? e.postData.contents : '';
  if (!contents) return {};

  if (contents.indexOf('=') !== -1 && contents.indexOf('{') !== 0) {
    return parseQueryString_(contents);
  }

  try {
    return JSON.parse(contents);
  } catch (_err) {
    return {};
  }
}

/**
 * Parses urlencoded query string
 */
function parseQueryString_(query) {
  const out = {};
  const pairs = String(query).split('&');

  for (let i = 0; i < pairs.length; i++) {
    const part = pairs[i];
    if (!part) continue;

    const idx = part.indexOf('=');
    const rawKey = idx >= 0 ? part.slice(0, idx) : part;
    const rawValue = idx >= 0 ? part.slice(idx + 1) : '';
    const key = decodeURIComponent(rawKey.replace(/\+/g, ' '));
    const value = decodeURIComponent(rawValue.replace(/\+/g, ' '));

    out[key] = value;
  }

  return out;
}

/**
 * Returns JSON response
 */
function jsonResponse_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
