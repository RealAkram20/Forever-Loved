<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->boolean('notified_7d_before')->default(false)->after('payment_reference');
            $table->boolean('notified_on_expiry')->default(false)->after('notified_7d_before');
            $table->boolean('notified_overdue')->default(false)->after('notified_on_expiry');
        });
    }

    public function down(): void
    {
        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->dropColumn(['notified_7d_before', 'notified_on_expiry', 'notified_overdue']);
        });
    }
};
