<?php

namespace App\Helpers;

use App\Models\Memorial;
use App\Models\MemorialShare;
use App\Models\MemorialView;
use Carbon\Carbon;

class MemorialStatsHelper
{
    public static function get(Memorial $memorial): array
    {
        $today = Carbon::today();
        $lastWeek = Carbon::today()->subDays(7);

        return [
            'views_today' => static::countDistinct(MemorialView::class, $memorial->id, 'viewed_at', $today),
            'views_last_week' => static::countDistinct(MemorialView::class, $memorial->id, 'viewed_at', $lastWeek),
            'views_all_time' => static::countDistinct(MemorialView::class, $memorial->id, 'viewed_at'),
            'shares_today' => static::countDistinct(MemorialShare::class, $memorial->id, 'shared_at', $today),
            'shares_last_week' => static::countDistinct(MemorialShare::class, $memorial->id, 'shared_at', $lastWeek),
            'shares_all_time' => static::countDistinct(MemorialShare::class, $memorial->id, 'shared_at'),
        ];
    }

    private static function countDistinct(string $model, int $memorialId, string $dateColumn, ?Carbon $since = null): int
    {
        $query = $model::where('memorial_id', $memorialId);
        if ($since) {
            $query->where($dateColumn, '>=', $since);
        }
        return (int) $query->selectRaw('COUNT(DISTINCT visitor_hash) as cnt')->value('cnt');
    }
}
