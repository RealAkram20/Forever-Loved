<?php

namespace App\Http\Controllers;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Database\Seeders\SubscriptionPlanSeeder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use PDO;
use PDOException;

class InstallController extends Controller
{
    // ─── Step 1: Requirements ───────────────────────────────────────────

    public function requirements()
    {
        $checks = $this->runRequirementChecks();
        $allPassed = collect($checks['php'])->every(fn ($c) => $c['pass'])
            && collect($checks['extensions'])->every(fn ($c) => $c['pass'])
            && collect($checks['writable'])->every(fn ($c) => $c['pass']);

        return view('pages.install.requirements', compact('checks', 'allPassed'))
            ->with('currentStep', 'requirements');
    }

    private function runRequirementChecks(): array
    {
        return [
            'php' => [
                ['label' => 'PHP >= 8.2', 'pass' => version_compare(PHP_VERSION, '8.2.0', '>='), 'value' => PHP_VERSION],
            ],
            'extensions' => collect([
                'pdo_mysql', 'pdo_sqlite', 'mbstring', 'openssl',
                'fileinfo', 'curl', 'tokenizer', 'xml', 'ctype', 'json',
            ])->map(fn ($ext) => [
                'label' => $ext,
                'pass' => extension_loaded($ext),
            ])->push([
                'label' => 'bcmath or gmp',
                'pass' => extension_loaded('bcmath') || extension_loaded('gmp'),
            ])->all(),
            'writable' => collect([
                'storage' => storage_path(),
                'storage/framework' => storage_path('framework'),
                'storage/logs' => storage_path('logs'),
                'bootstrap/cache' => base_path('bootstrap/cache'),
                'database/geo' => database_path('geo'),
            ])->map(fn ($path, $label) => [
                'label' => $label,
                'pass' => is_writable($path),
                'value' => $path,
            ])->push([
                'label' => '.env writable',
                'pass' => is_writable(base_path('.env')) || is_writable(base_path()),
            ])->values()->all(),
        ];
    }

    // ─── Step 2: Database ───────────────────────────────────────────────

    public function database()
    {
        $db = session('install.database', [
            'host' => '127.0.0.1',
            'port' => '3306',
            'database' => 'forever_love',
            'username' => 'root',
            'password' => '',
        ]);

        return view('pages.install.database', compact('db'))
            ->with('currentStep', 'database');
    }

    public function validateDatabase(Request $request)
    {
        $request->validate([
            'host' => 'required|string',
            'port' => 'required|numeric',
            'database' => 'required|string',
            'username' => 'required|string',
            'password' => 'nullable|string',
        ]);

        try {
            $dsn = "mysql:host={$request->host};port={$request->port}";
            $pdo = new PDO($dsn, $request->username, $request->password ?? '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$request->database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            $pdo->exec("USE `{$request->database}`");

            return response()->json(['success' => true, 'message' => 'Connection successful. Database is ready.']);
        } catch (PDOException $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }

    public function storeDatabase(Request $request)
    {
        $validated = $request->validate([
            'host' => 'required|string',
            'port' => 'required|numeric',
            'database' => 'required|string',
            'username' => 'required|string',
            'password' => 'nullable|string',
        ]);

        try {
            $dsn = "mysql:host={$validated['host']};port={$validated['port']}";
            $pdo = new PDO($dsn, $validated['username'], $validated['password'] ?? '');
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$validated['database']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        } catch (PDOException $e) {
            return back()->withInput()->withErrors(['database' => 'Database connection failed: '.$e->getMessage()]);
        }

        session(['install.database' => $validated]);

        return redirect()->route('install.settings');
    }

    // ─── Step 3: App Settings ───────────────────────────────────────────

    public function appSettings(Request $request)
    {
        $settings = session('install.settings', [
            'app_name' => 'Forever Love',
            'app_url' => $request->getSchemeAndHttpHost(),
            'app_env' => 'production',
        ]);

        return view('pages.install.app-settings', compact('settings'))
            ->with('currentStep', 'settings');
    }

    public function storeAppSettings(Request $request)
    {
        $validated = $request->validate([
            'app_name' => 'required|string|max:100',
            'app_url' => 'required|url|max:255',
            'app_env' => 'required|in:local,production',
        ]);

        session(['install.settings' => $validated]);

        return redirect()->route('install.admin');
    }

    // ─── Step 4: Admin Account ──────────────────────────────────────────

    public function adminAccount()
    {
        $admin = session('install.admin', [
            'name' => '',
            'email' => '',
        ]);

        return view('pages.install.admin', compact('admin'))
            ->with('currentStep', 'admin');
    }

    public function storeAdmin(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8|confirmed',
        ]);

        session(['install.admin' => [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]]);

        return redirect()->route('install.run');
    }

    // ─── Step 5: Run Installation ───────────────────────────────────────

    public function run()
    {
        $db = session('install.database');
        $settings = session('install.settings');
        $admin = session('install.admin');

        if (! $db || ! $settings || ! $admin) {
            return redirect()->route('install.requirements')
                ->with('error', 'Please complete all previous steps first.');
        }

        return view('pages.install.progress')
            ->with('currentStep', 'install');
    }

    public function execute(Request $request)
    {
        $db = session('install.database');
        $settings = session('install.settings');
        $admin = session('install.admin');

        if (! $db || ! $settings || ! $admin) {
            return response()->json(['success' => false, 'message' => 'Session expired. Please restart the installer.'], 422);
        }

        $steps = [];

        try {
            // 1. Write .env
            $steps[] = ['step' => 'Writing configuration file...', 'status' => 'running'];
            $this->writeEnvFile($db, $settings);
            $steps[count($steps) - 1]['status'] = 'done';

            // 2. Reload config from the fresh .env
            $steps[] = ['step' => 'Loading configuration...', 'status' => 'running'];
            $this->reloadConfig($db, $settings);
            $steps[count($steps) - 1]['status'] = 'done';

            // 3. Generate app key
            $steps[] = ['step' => 'Generating application key...', 'status' => 'running'];
            Artisan::call('key:generate', ['--force' => true]);
            $steps[count($steps) - 1]['status'] = 'done';

            // 4. Run migrations
            $steps[] = ['step' => 'Running database migrations...', 'status' => 'running'];
            Artisan::call('migrate', ['--force' => true]);
            $steps[count($steps) - 1]['status'] = 'done';

            // 5. Seed roles & plans
            $steps[] = ['step' => 'Seeding roles and subscription plans...', 'status' => 'running'];
            Artisan::call('db:seed', ['--class' => RoleSeeder::class, '--force' => true]);
            Artisan::call('db:seed', ['--class' => SubscriptionPlanSeeder::class, '--force' => true]);
            $steps[count($steps) - 1]['status'] = 'done';

            // 6. Create admin user
            $steps[] = ['step' => 'Creating admin account...', 'status' => 'running'];
            $user = User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => Hash::make($admin['password']),
                ]
            );
            $user->assignRole('super-admin');
            $steps[count($steps) - 1]['status'] = 'done';

            // 7. Storage link
            $steps[] = ['step' => 'Creating storage link...', 'status' => 'running'];
            try {
                Artisan::call('storage:link');
            } catch (\Exception $e) {
                // Link may already exist
            }
            $steps[count($steps) - 1]['status'] = 'done';

            // 8. Cache config & routes
            $steps[] = ['step' => 'Optimizing application...', 'status' => 'running'];
            Artisan::call('config:clear');
            Artisan::call('route:clear');
            Artisan::call('view:clear');
            $steps[count($steps) - 1]['status'] = 'done';

            // 9. Create installed lock
            $steps[] = ['step' => 'Finalizing installation...', 'status' => 'running'];
            File::put(storage_path('installed'), json_encode([
                'installed_at' => now()->toIso8601String(),
                'version' => trim(File::get(base_path('version.txt'))),
            ]));
            $steps[count($steps) - 1]['status'] = 'done';

            session()->forget(['install.database', 'install.settings', 'install.admin']);

            return response()->json(['success' => true, 'steps' => $steps]);

        } catch (\Exception $e) {
            $steps[] = ['step' => 'Error: '.$e->getMessage(), 'status' => 'error'];

            return response()->json(['success' => false, 'steps' => $steps, 'message' => $e->getMessage()], 500);
        }
    }

    private function writeEnvFile(array $db, array $settings): void
    {
        $isProduction = ($settings['app_env'] ?? 'production') === 'production';

        $env = <<<ENV
APP_NAME="{$settings['app_name']}"
APP_ENV={$settings['app_env']}
APP_KEY=
APP_DEBUG={$this->bool(! $isProduction)}
APP_URL={$settings['app_url']}

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=mysql
DB_HOST={$db['host']}
DB_PORT={$db['port']}
DB_DATABASE={$db['database']}
DB_USERNAME={$db['username']}
DB_PASSWORD={$db['password']}

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
SESSION_SECURE_COOKIE={$this->bool($isProduction)}

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync

CACHE_STORE=database

MAIL_MAILER=log
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="\${APP_NAME}"

VITE_APP_NAME="\${APP_NAME}"

PESAPAL_VERIFY_SSL={$this->bool($isProduction)}
ENV;

        File::put(base_path('.env'), $env);
    }

    private function reloadConfig(array $db, array $settings): void
    {
        config([
            'app.name' => $settings['app_name'],
            'app.env' => $settings['app_env'],
            'app.url' => $settings['app_url'],
            'database.connections.mysql.host' => $db['host'],
            'database.connections.mysql.port' => $db['port'],
            'database.connections.mysql.database' => $db['database'],
            'database.connections.mysql.username' => $db['username'],
            'database.connections.mysql.password' => $db['password'] ?? '',
        ]);

        app('db')->purge('mysql');
    }

    private function bool(bool $value): string
    {
        return $value ? 'true' : 'false';
    }

    // ─── Complete ───────────────────────────────────────────────────────

    public function complete()
    {
        return view('pages.install.complete')
            ->with('currentStep', 'install');
    }
}
