# Restoring the Database from SQL Backup

If you have a `.sql` backup file (e.g. `forever_love_2026-03-12.sql`), you can restore it like this:

## Prerequisites
- XAMPP MySQL must be running
- You need a valid SQL dump file

## Restore Steps

### Option 1: PowerShell (recommended)
```powershell
cd c:\xampp\htdocs\Forever-love

# Replace with your actual backup filename
$backupFile = "database\backups\forever_love_2026-03-12.sql"
C:\xampp\mysql\bin\mysql.exe -u root forever_love < $backupFile
```

### Option 2: Command Prompt
```cmd
cd c:\xampp\htdocs\Forever-love
C:\xampp\mysql\bin\mysql.exe -u root forever_love < database\backups\YOUR_BACKUP_FILE.sql
```

### Option 3: phpMyAdmin
1. Open http://localhost/phpmyadmin
2. Select the `forever_love` database
3. Click **Import**
4. Choose your `.sql` file
5. Click **Go**

## Where to Look for Lost Backups

If you had data before and lost it, check:

- **`database/backups/`** – if you ran the backup script
- **Downloads folder** – if you ever exported from phpMyAdmin
- **Old XAMPP install** – `C:\xampp\mysql\backup\` or `C:\xampp\mysql\data\`
- **Cloud storage** – OneDrive, Google Drive, Dropbox
- **Previous machine** – if you migrated computers

## Regular Backups

Run the backup script regularly:
```powershell
.\database\backup-db.ps1
```

Backups are saved to `database/backups/` with timestamps.
