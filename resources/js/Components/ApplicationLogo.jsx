export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            className={className}
            src="/img/logo.png"
            alt="SKE Logo"
            onError={(e) => {
                e.target.style.display = 'none';
                e.target.insertAdjacentHTML('afterend', '<span class="font-black text-gray-900">SKE</span>');
            }}
        />
    );
}
