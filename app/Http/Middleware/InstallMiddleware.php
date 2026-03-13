<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InstallMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $installed = file_exists(storage_path('installed'));
        $isInstallRoute = $request->is('install') || $request->is('install/*');

        if (! $installed) {
            // Force file-based sessions during installation (database may not exist yet).
            // This runs before StartSession in the middleware pipeline.
            config(['session.driver' => 'file', 'cache.default' => 'file']);

            if (! $isInstallRoute) {
                return redirect('/install');
            }
        }

        if ($installed && $isInstallRoute) {
            return redirect('/');
        }

        return $next($request);
    }
}
