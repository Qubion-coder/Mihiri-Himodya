# Google Apps Script Setup Guide

This script handles submissions from both the **RSVP Form** and **Wishes Section** into separate tabs with their respective headers.

## Headers Created:
- **RSVP Tab**:
  - `Timestamp` | `Full Name` | `Side` | `Guests` | `Dietary Notes`
- **WISH Tab**:
  - `Timestamp` | `Name` | `Message`

---

## Step-by-Step Setup:

1. **Open your Google Sheet** (or create a new one).
2. Go to the top menu: **Extensions** > **Apps Script**.
3. Clear any code in the editor and **paste the entire contents** of [`code.gs`](./code.gs).
4. *(Optional automatic setup)*:
   - In the toolbar dropdown, select **`setupSheets`** and click **Run**.
   - Review permissions if prompted (Click *Advanced* > *Go to Untitled project (unsafe)* > *Allow*).
   - Both **RSVP** and **WISH** tabs will be automatically created with bold navy headers and frozen header rows!
5. **Deploy the Web App**:
   - Click **Deploy** > **New deployment** (top right).
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Set **Description**: `Wedding RSVP & Wishes API`
   - Set **Execute as**: `Me` (your email)
   - Set **Who has access**: **`Anyone`** (⚠️ Critical for public form submissions)
   - Click **Deploy**.
6. **Copy the Web App URL** (ends in `/exec`).
7. Update the script URL in your frontend or `.env` file if needed.
