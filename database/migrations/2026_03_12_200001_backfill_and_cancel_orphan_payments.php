<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Backfill memorial_id from metadata, cancel orders without valid memorial.
     */
    public function up(): void
    {
        $orders = DB::table('payment_orders')->whereNull('memorial_id')->get();

        foreach ($orders as $order) {
            $metadata = $order->metadata ? json_decode($order->metadata, true) : [];
            $memorialSlug = $metadata['memorial_slug'] ?? null;

            if ($memorialSlug) {
                $memorial = DB::table('memorials')->where('slug', $memorialSlug)->where('user_id', $order->user_id)->first();
                if ($memorial) {
                    DB::table('payment_orders')->where('id', $order->id)->update(['memorial_id' => $memorial->id]);
                    continue;
                }
            }

            if ($order->status === 'pending') {
                DB::table('payment_orders')->where('id', $order->id)->update(['status' => 'cancelled']);
            }
        }
    }

    public function down(): void
    {
        // No reverse - data already modified
    }
};
