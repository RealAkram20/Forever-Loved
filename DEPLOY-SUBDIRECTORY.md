# Deploying Forever-love in a Subdirectory

This app works at `http://localhost/Forever-love/` (XAMPP) and on shared hosting in a subdirectory.

## How it works

- **Root `.htaccess`** rewrites all requests to the `public/` folder internally (no `/public` in the URL)
- **`public/.htaccess`** sends non-file requests to Laravel's `index.php`
- **`APP_URL`** in `.env` must match your base URL (e.g. `http://localhost/Forever-love` or `https://yourdomain.com/Forever-love`)

## If you get 404 on localhost

1. **Enable mod_rewrite**: In XAMPP, edit `httpd.conf` and ensure this line is uncommented:
   ```
   LoadModule rewrite_module modules/mod_rewrite.so
   ```

2. **Allow .htaccess**: In `httpd.conf`, find the `<Directory "C:/xampp/htdocs">` section and set:
   ```
   AllowOverride All
   ```

3. **Restart Apache** after changes.

## Shared hosting

- Upload the entire project (including `.htaccess` files)
- Set `APP_URL` in `.env` to your full URL (e.g. `https://yourdomain.com/Forever-love`)
- If your path differs (e.g. `https://yourdomain.com/`), update `RewriteBase` in both `.htaccess` files to match
