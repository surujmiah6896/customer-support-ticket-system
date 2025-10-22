const CountStatus = ({ tickets, title, type }) => {
  const colors = {
    open: "bg-green-500 text-green-800",
    in_progress: "bg-yellow-500 text-yellow-800",
    resolved: "bg-blue-500 text-blue-800",
    closed: "bg-gray-500 text-gray-800",
    low: "bg-green-500 text-green-800",
    medium: "bg-yellow-500 text-yellow-800",
    high: "bg-orange-500 text-orange-800",
    urgent: "bg-red-500 text-red-800",
    technical: "bg-purple-500 text-purple-800",
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <span className={`w-3 h-3 ${colors[type]} rounded-full`}></span>
        <span className="text-sm font-medium text-gray-700">
          {title}: {tickets.filter((ticket) => ticket.status === type).length}
        </span>
      </div>
    </>
  );
};

export default CountStatus;
