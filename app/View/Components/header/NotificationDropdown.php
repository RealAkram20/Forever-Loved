<?php

namespace App\View\Components\header;

use App\Services\NotificationService;
use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class NotificationDropdown extends Component
{
    public array $notifications = [];
    public int $unreadCount = 0;

    public function __construct()
    {
        $user = auth()->user();
        if ($user) {
            $this->notifications = NotificationService::getRecentForUser($user->id);
            $this->unreadCount = NotificationService::unreadCount($user->id);
        }
    }

    public function render(): View|Closure|string
    {
        return view('components.header.notification-dropdown');
    }
}
