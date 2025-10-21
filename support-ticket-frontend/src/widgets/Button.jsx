export const Button = ({
  color = "bg-blue-600",
  icon,
  className = "",
  children = "Facebook",
  type = "button",
  onClick,
  disabled,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed  ${color} ${className}`}
      {...props}
    >
      <p className="flex flex-row items-center justify-center gap-2">
        {icon}
        {children}
      </p>
    </button>
  );
};
