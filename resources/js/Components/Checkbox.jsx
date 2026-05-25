export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-gray-300 text-gray-900 shadow-sm focus:ring-gray-800 ' +
                className
            }
        />
    );
}
