import { useState } from "react";
import { toTitleCase } from "../helpers";

const Filters = ({
  filters,
  setFilters,
}: {
  filters: any;
  setFilters: React.Dispatch<
    React.SetStateAction<{
      typeOfMedia: string;
      watched: string;
    }>
  >;
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative flex items-center justify-center">
      <button
        onClick={handleShowDropdown}
        data-dropdown-toggle="dropdown"
        className="rounded-xl bg-slate-700 px-8 py-3 font-semibold text-white no-underline transition hover:bg-slate-600 inline-flex items-center"
        type="button"
      >
        Filters
        <svg
          className="ml-2 h-4 w-4"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {showDropdown && (
        <div className="absolute left-auto translate-x-1/4 md:left-0 md:translate-x-0 top-14 z-10 w-56 rounded-lg bg-white p-3 shadow dark:bg-gray-700">
          <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Type of media
          </h6>
          <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
            {["both", "movies", "shows"].map((t:string) => (
              <li className="flex items-center" key={t}>
                <input
                  id={t}
                  type="radio"
                  value={t}
                  checked={filters.typeOfMedia === t}
                  onChange={() => setFilters({...filters, typeOfMedia: t})}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                />
                <label
                  htmlFor={t}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {toTitleCase(t)}
                </label>
              </li>
            ))}
          </ul>
          <h6 className="mt-3 mb-3 text-sm font-medium text-gray-900 dark:text-white">
            Watched
          </h6>
          <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
            {["both", "yes", "no"].map((t:string) => (
              <li className="flex items-center" key={t}>
                <input
                  id={t}
                  type="radio"
                  value={t}
                  checked={filters.watched === t}
                  onChange={() => setFilters({...filters, watched: t})}
                  className="text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700"
                />
                <label
                  htmlFor={t}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {toTitleCase(t)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Filters;