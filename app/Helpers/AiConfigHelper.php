<?php

namespace App\Helpers;

use App\Models\SystemSetting;

class AiConfigHelper
{
    private static ?array $resolved = null;

    /**
     * Resolve and cache the effective AI configuration from SystemSetting (primary)
     * with a fallback to config/services.php (.env).
     */
    public static function resolve(): array
    {
        if (static::$resolved !== null) {
            return static::$resolved;
        }

        if (SystemSetting::get('ai.enabled') && SystemSetting::get('ai.api_key')) {
            $provider = SystemSetting::get('ai.provider');
            $displayName = match ($provider) {
                'openai' => 'ChatGPT',
                'anthropic' => 'Claude AI',
                'gemini' => 'Google Gemini',
                default => null,
            };

            if ($displayName) {
                return static::$resolved = [
                    'enabled' => true,
                    'provider' => $provider,
                    'display_name' => $displayName,
                    'api_key' => SystemSetting::get('ai.api_key'),
                    'model' => SystemSetting::get('ai.model') ?: static::defaultModel($provider),
                ];
            }
        }

        foreach (['openai', 'anthropic', 'gemini'] as $provider) {
            if (config("services.{$provider}.enabled") && config("services.{$provider}.api_key")) {
                $displayName = match ($provider) {
                    'openai' => 'ChatGPT',
                    'anthropic' => 'Claude AI',
                    'gemini' => 'Google Gemini',
                };

                return static::$resolved = [
                    'enabled' => true,
                    'provider' => $provider,
                    'display_name' => $displayName,
                    'api_key' => config("services.{$provider}.api_key"),
                    'model' => config("services.{$provider}.model") ?: static::defaultModel($provider),
                ];
            }
        }

        return static::$resolved = [
            'enabled' => false,
            'provider' => null,
            'display_name' => null,
            'api_key' => null,
            'model' => null,
        ];
    }

    public static function isEnabled(): bool
    {
        return static::resolve()['enabled'];
    }

    public static function getActiveProvider(): ?string
    {
        return static::resolve()['display_name'];
    }

    public static function getApiKey(): ?string
    {
        return static::resolve()['api_key'];
    }

    public static function getModel(): ?string
    {
        return static::resolve()['model'];
    }

    public static function getProviderSlug(): ?string
    {
        return static::resolve()['provider'];
    }

    /**
     * Reset the cached resolution (useful after admin saves new settings).
     */
    public static function flush(): void
    {
        static::$resolved = null;
    }

    private static function defaultModel(string $provider): string
    {
        return match ($provider) {
            'openai' => 'gpt-4o-mini',
            'anthropic' => 'claude-3-5-sonnet-20241022',
            'gemini' => 'gemini-2.0-flash',
            default => '',
        };
    }
}
