import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ className = '', ...props }) {
    const { app_logo } = usePage().props;
    const logoSrc = app_logo ? `${window.storageUrl}${app_logo}` : '/img/logo.png';

    return (
        <img
            {...props}
            className={className}
            src={logoSrc}
            alt="SKE Logo"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.insertAdjacentHTML('afterend', '<span class="font-black text-gray-900">SKE</span>');
            }}
        />
    );
}
