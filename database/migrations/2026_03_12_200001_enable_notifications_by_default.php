<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Enable push and email notifications by default for existing installations.
     */
    public function up(): void
    {
        $now = now();
        foreach (['notifications.push_enabled', 'notifications.email_enabled'] as $key) {
            DB::table('system_settings')->updateOrInsert(
                ['key' => $key],
                ['value' => '1', 'group' => 'notifications', 'type' => 'boolean', 'created_at' => $now, 'updated_at' => $now]
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('system_settings')
            ->whereIn('key', ['notifications.push_enabled', 'notifications.email_enabled'])
            ->update(['value' => '0']);
    }
};
