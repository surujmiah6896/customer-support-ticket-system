
import { getColor } from "../utils/getColor";

const Badge = ({ title }) => {
  return (
    <div className="ml-2 flex-shrink-0 flex">
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getColor(
          title
        )}`}
      >
        {title}
      </span>
    </div>
  );
};

export default Badge;
