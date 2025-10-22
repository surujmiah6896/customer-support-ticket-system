
export const FormGroup = ({
  label,
  requiredStatus = false,
  error,
  type = "text",
  options = [],
  children,
  ...inputProps
}) => {
  const renderInput = () => {
    const baseClasses = `w-full py-2 px-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`;

    switch (type) {
      case "select":
        return (
          <select
            className={`${baseClasses} bg-white cursor-pointer`}
            style={{ appearance: "menulist" }}
            {...inputProps}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
        );

      case "textarea":
        return (
          <textarea
            className={`${baseClasses} resize-vertical`}
            {...inputProps}
          >
            {children}
          </textarea>
        );

      case "file":
        return (
          <input
            type="file"
            className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-3 file:border file:border-gray-300 file:rounded file:bg-white file:text-gray-700"
            {...inputProps}
          />
        );

      default:
        return <input type={type} className={baseClasses} {...inputProps} />;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label} {requiredStatus && <span className="text-red-600">*</span>}
      </label>
      {renderInput()}
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};