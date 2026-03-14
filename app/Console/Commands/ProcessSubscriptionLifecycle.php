<?php

namespace App\Console\Commands;

use App\Models\UserSubscription;
use App\Services\NotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessSubscriptionLifecycle extends Command
{
    protected $signature = 'subscriptions:process-lifecycle';

    protected $description = 'Send expiry notifications (7-day, same-day) and transition overdue subscriptions';

    public function handle(): int
    {
        $this->sendSevenDayReminders();
        $this->sendExpiryDayNotifications();
        $this->transitionOverdueSubscriptions();

        return self::SUCCESS;
    }

    private function sendSevenDayReminders(): void
    {
        $subscriptions = UserSubscription::with(['user', 'memorial.owner', 'plan'])
            ->expiringSoon(7)
            ->where('notified_7d_before', false)
            ->get();

        foreach ($subscriptions as $sub) {
            try {
                $daysLeft = $sub->daysUntilExpiry() ?? 7;
                NotificationService::notifySubscriptionExpiringSoon($sub, $daysLeft);
                $sub->update(['notified_7d_before' => true]);
                $this->info("7-day reminder sent for subscription #{$sub->id}");
            } catch (\Throwable $e) {
                Log::warning('Failed to send 7-day expiry reminder', [
                    'subscription_id' => $sub->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        if ($subscriptions->isNotEmpty()) {
            $this->info("Sent {$subscriptions->count()} 7-day reminder(s).");
        }
    }

    private function sendExpiryDayNotifications(): void
    {
        $subscriptions = UserSubscription::with(['user', 'memorial.owner', 'plan'])
            ->expiresOnDate(now()->toDateString())
            ->where('notified_on_expiry', false)
            ->get();

        foreach ($subscriptions as $sub) {
            try {
                NotificationService::notifySubscriptionExpiredToday($sub);
                $sub->update(['notified_on_expiry' => true]);
                $this->info("Expiry-day notification sent for subscription #{$sub->id}");
            } catch (\Throwable $e) {
                Log::warning('Failed to send expiry-day notification', [
                    'subscription_id' => $sub->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        if ($subscriptions->isNotEmpty()) {
            $this->info("Sent {$subscriptions->count()} expiry-day notification(s).");
        }
    }

    private function transitionOverdueSubscriptions(): void
    {
        $subscriptions = UserSubscription::with(['user', 'memorial.owner', 'plan'])
            ->needsExpiryTransition()
            ->get();

        $neverExpiresPlans = $subscriptions->filter(
            fn ($sub) => $sub->plan && $sub->plan->feature_never_expires
        );
        foreach ($neverExpiresPlans as $sub) {
            $sub->update(['ends_at' => null]);
            $this->info("Extended never-expires subscription #{$sub->id}");
        }

        $overdue = $subscriptions->reject(
            fn ($sub) => $sub->plan && $sub->plan->feature_never_expires
        );

        foreach ($overdue as $sub) {
            try {
                $sub->update(['status' => 'overdue']);

                if (! $sub->notified_overdue) {
                    NotificationService::notifySubscriptionOverdue($sub);
                    $sub->update(['notified_overdue' => true]);
                }

                $this->info("Marked subscription #{$sub->id} as overdue");
            } catch (\Throwable $e) {
                Log::warning('Failed to process overdue subscription', [
                    'subscription_id' => $sub->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        if ($overdue->isNotEmpty()) {
            $this->info("Transitioned {$overdue->count()} subscription(s) to overdue.");
        }
    }
}
