<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            $seo = \App\Models\SeoSetting::first();
        @endphp
        @if($seo && $seo->description)
            <meta name="description" content="{{ $seo->description }}">
        @endif
        @if($seo && $seo->keywords)
            <meta name="keywords" content="{{ $seo->keywords }}">
        @endif

        @if(config('services.google.analytics_id'))
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('services.google.analytics_id') }}"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '{{ config('services.google.analytics_id') }}');
            </script>
        @endif
        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        <script>window.storageUrl = "{{ asset('storage') }}/";</script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
        <link rel="icon" type="image/png" href="{{ asset('img/logo.png') }}">
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
