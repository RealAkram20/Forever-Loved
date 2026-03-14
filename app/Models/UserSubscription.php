<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'memorial_id',
        'subscription_plan_id',
        'starts_at',
        'ends_at',
        'status',
        'payment_gateway',
        'payment_reference',
        'notified_7d_before',
        'notified_on_expiry',
        'notified_overdue',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'notified_7d_before' => 'boolean',
            'notified_on_expiry' => 'boolean',
            'notified_overdue' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function memorial(): BelongsTo
    {
        return $this->belongsTo(Memorial::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'subscription_plan_id');
    }

    public function isActive(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if ($this->ends_at && $this->ends_at->isPast()) {
            return false;
        }

        return true;
    }

    public function isOverdue(): bool
    {
        return $this->status === 'overdue';
    }

    public function isExpired(): bool
    {
        if ($this->status === 'expired') {
            return true;
        }

        if ($this->status === 'active' && $this->ends_at && $this->ends_at->isPast()) {
            return true;
        }

        return false;
    }

    public function isExpiringSoon(int $days = 7): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if (! $this->ends_at) {
            return false;
        }

        return $this->ends_at->isFuture()
            && $this->ends_at->diffInDays(now()) <= $days;
    }

    public function daysUntilExpiry(): ?int
    {
        if (! $this->ends_at) {
            return null;
        }

        if ($this->ends_at->isPast()) {
            return 0;
        }

        return (int) now()->diffInDays($this->ends_at);
    }

    // ─── Scopes ─────────────────────────────────────────────────────

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>', now());
            });
    }

    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('status', 'overdue');
    }

    public function scopeExpiringSoon(Builder $query, int $days = 7): Builder
    {
        return $query->where('status', 'active')
            ->whereNotNull('ends_at')
            ->where('ends_at', '>', now())
            ->where('ends_at', '<=', now()->addDays($days));
    }

    public function scopeNeedsExpiryTransition(Builder $query): Builder
    {
        return $query->where('status', 'active')
            ->whereNotNull('ends_at')
            ->where('ends_at', '<=', now());
    }

    public function scopeExpiresOnDate(Builder $query, $date): Builder
    {
        return $query->where('status', 'active')
            ->whereNotNull('ends_at')
            ->whereDate('ends_at', $date);
    }
}
