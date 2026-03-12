<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Billing per memorial: link payments and subscriptions to memorials.
     */
    public function up(): void
    {
        Schema::table('payment_orders', function (Blueprint $table) {
            $table->foreignId('memorial_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });

        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->foreignId('memorial_id')->nullable()->after('user_id')->constrained()->nullOnDelete();
        });

        Schema::table('memorials', function (Blueprint $table) {
            $table->foreignId('subscription_plan_id')->nullable()->after('plan')->constrained()->nullOnDelete();
            $table->foreignId('user_subscription_id')->nullable()->after('subscription_plan_id')->constrained('user_subscriptions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('memorials', function (Blueprint $table) {
            $table->dropForeign(['subscription_plan_id']);
            $table->dropForeign(['user_subscription_id']);
        });
        Schema::table('user_subscriptions', function (Blueprint $table) {
            $table->dropForeign(['memorial_id']);
        });
        Schema::table('payment_orders', function (Blueprint $table) {
            $table->dropForeign(['memorial_id']);
        });
    }
};
