@extends('layouts.install')

@section('content')
    <div class="text-center py-4">
        <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg class="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Installation Complete</h2>
        <p class="mb-8 text-sm text-gray-500 dark:text-gray-400">
            Your application has been installed successfully. You can now sign in with your admin account.
        </p>

        <div class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-left dark:border-gray-700 dark:bg-gray-900">
            <h3 class="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Recommended next steps:</h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li class="flex items-start gap-2">
                    <span class="mt-0.5 text-brand-500">1.</span>
                    <span>Sign in and configure your branding, payment, and SMTP settings in <strong>Settings</strong>.</span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="mt-0.5 text-brand-500">2.</span>
                    <span>Optionally import geo data for country/state/city selectors: <code class="rounded bg-gray-200 px-1.5 py-0.5 text-xs dark:bg-gray-700">php artisan geo:import --download</code></span>
                </li>
                <li class="flex items-start gap-2">
                    <span class="mt-0.5 text-brand-500">3.</span>
                    <span>Create your first memorial and invite contributors.</span>
                </li>
            </ul>
        </div>

        <a href="{{ url('/login') }}"
           class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600">
            Go to Login
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </a>
    </div>
@endsection
