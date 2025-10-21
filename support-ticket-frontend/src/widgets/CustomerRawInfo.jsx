
const CustomerRawInfo = ({title, value}) => {
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="mt-1 text-sm text-gray-900">
        {value || "Not assigned"}
      </p>
    </div>
  );
}

export default CustomerRawInfo
