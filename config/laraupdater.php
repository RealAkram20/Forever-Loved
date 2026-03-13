<?php
/*
 * LaraUpdater configuration for Forever-love
 * @see https://github.com/pietrocinaglia/laraupdater
 */

return [

    /*
    * Temporary folder to store update before to install it.
    */
    'tmp_folder_name' => 'tmp',

    /*
    * Script's filename called during the update.
    */
    'script_filename' => 'upgrade.php',

    /*
    * URL where your updates are stored.
    * Set via LARA_UPDATER_URL in .env, or defaults to APP_URL/updates (public/updates/ folder).
    */
    'update_baseurl' => env('LARA_UPDATER_URL') ?: rtrim(config('app.url'), '/') . '/updates',

    /*
    * Set a middleware for the route: updater.update
    * Restrict to admin/super-admin roles only.
    */
    'middleware' => ['web', 'auth', 'role:admin|super-admin'],

    /*
    * Set which users can perform an update;
    * false = allow any user passing middleware (all admin|super-admin)
    * [1, 2, 3] = restrict to specific user IDs
    */
    'allow_users_id' => false,
];
