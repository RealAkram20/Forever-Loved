@extends('layouts.app')

@section('content')
    <x-common.page-breadcrumb pageTitle="System Updates" />

    <x-common.component-card title="Current Version" desc="Your application version and update status.">
        <div class="space-y-4">
            <div class="flex items-center gap-3">
                <span class="rounded-lg bg-brand-100 dark:bg-brand-900/30 px-3 py-1.5 font-mono text-sm font-medium text-brand-700 dark:text-brand-300">
                    {{ $currentVersion }}
                </span>
                <span class="text-sm text-gray-600 dark:text-gray-400">installed</span>
            </div>

            @if($updateAvailable)
                <div class="mt-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
                    <h4 class="font-semibold text-amber-900 dark:text-amber-100">Update Available</h4>
                    <p class="mt-1 text-sm text-amber-800 dark:text-amber-200">{{ $updateAvailable['description'] ?? 'A new version is available.' }}</p>
                    <p class="mt-1 text-xs text-amber-600 dark:text-amber-400">Version {{ $updateAvailable['version'] ?? '?' }}</p>
                    <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        An update notification will appear in the bottom-right corner when you browse the app. Click <strong>Update Now</strong> to install.
                        Or run: <code class="rounded bg-gray-200 dark:bg-gray-700 px-1">php artisan laraupdater:update</code>
                    </p>
                </div>
            @else
                <p class="text-sm text-gray-600 dark:text-gray-400">You are running the latest version.</p>
            @endif
        </div>
    </x-common.component-card>

    <x-common.component-card title="Update Server" desc="Where updates are fetched from.">
        <p class="text-sm text-gray-600 dark:text-gray-400">
            <code class="rounded bg-gray-200 dark:bg-gray-700 px-1">{{ $updateBaseUrl }}</code>
        </p>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-500">
            Default: <code>APP_URL/updates</code> (serves from <code>public/updates/</code>). Override with <code>LARA_UPDATER_URL</code> in <code>.env</code> if using a separate update server.
        </p>
    </x-common.component-card>

    <x-common.component-card title="How to Publish an Update" desc="Steps for releasing updates to live servers.">
        <ol class="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>Create a zip of changed files (same structure as your app).</li>
            <li>Create <code>laraupdater.json</code>: <code>{"version":"1.0.1","archive":"RELEASE-1.01.zip","description":"Bug fixes"}</code></li>
            <li>Upload both to your update server (e.g. <code>/updates/</code> folder).</li>
            <li>Admins will see the update notification and can click Update Now.</li>
        </ol>
        <p class="mt-4 text-xs text-gray-500">
            See <code>LARA_UPDATER.md</code> in the project root for full documentation.
        </p>
    </x-common.component-card>
@endsection
