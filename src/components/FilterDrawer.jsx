import {  useState } from "react";
import Slider from "rc-slider";
import { GrFormSearch } from "react-icons/gr";
import { GrFormClose } from "react-icons/gr";
import { GrFormFilter } from "react-icons/gr";
import { colors, countryLeagueMap, maxYear, minYear } from "../constants";
import "rc-slider/assets/index.css";

const FilterDrawer = ({
  availableLeagues,
  clearFilters,
  clearSearch,
  filters,
  handleChange,
  handleChangeSearch,
  handleSliderChange,
  handleSubmitSearch,
  handleFilterSubmit,
  setFilters,
  open,
  search,
  setOpen,
}) => {

  const [titlesErrorValue, setTitlesErrorValue] = useState(null)

  const areFiltersApplied = () => {
    return (
      filters.country ||
      filters.league ||
      filters.titles ||
      filters.colors.length > 0 ||
      filters.minFoundationYear !== 1850 ||
      filters.maxFoundationYear !== new Date().getFullYear()
    );
  };

  return (
    <>
      {/* Botón para abrir el drawer */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center items-start mb-4">
        <div className="hidden md:block">
          <form onSubmit={handleSubmitSearch}>
            <label className="bg-white rounded-md flex items-center w-full md:min-w-[400px] min-h-[40px] border border-[#D0D0D0]">
              <button type="submit">
                <GrFormSearch className="size-[34px]" />
              </button>
              <input
                className="outline-none flex-1 placeholder:font-normal placeholder:text-sm placeholder:text-[#D0D0D0]"
                placeholder="What team are you looking for?"
                value={search}
                onChange={(e) => handleChangeSearch(e.target.value)}
              ></input>
              <button type="button" onClick={clearSearch}>
                <GrFormClose className="size-[34px]" />
              </button>
            </label>
          </form>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="relative rounded-md border border-[#D0D0D0] flex items-center gap-x-2 min-[40px] min-w-[100px] bg-white px-4 py-2 text-[#666767] font-normal text-sm"
        >
          <GrFormFilter className="size-[30px]" />
          <span>Filters</span>
          {areFiltersApplied() && (
            <span className="size-[14px] absolute top-[-5px] left-[-5px] rounded-full bg-green-600"></span>
          )}
        </button>
      </div>

      {/* Overlay oscuro detrás del drawer */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
        ></div>
      )}

      {/* Contenedor del drawer */}
      {open && (
        <div className="fixed top-0 right-0 w-[90%] md:w-[334px] h-full bg-gray-100 shadow-lg z-50 animate-fade-left animate-duration-500">
          <h2 className="flex items-center justify-between bg-[#D1E4F0] p-3 pl-[40px] md:pl-3 text-sm font-bold leading-[16px] text-[#000000]">
            Filters
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <GrFormClose className="size-[34px]" />
            </button>
          </h2>
          <div
            className="flex flex-col items-center overflow-auto px-6 py-4"
            style={{
              height: "calc(100% - 119px)",
            }}
          >
            {/* Country Filter */}
            <div className="my-4 w-full">
              <h3 className="mb-4 text-center text-base font-bold text-[#000000] uppercase">
                Country
              </h3>
              <select
                value={filters.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="block w-full p-2 border border-[#D0D0D0] rounded-lg bg-white outline-none"
              >
                <option value="">All</option>
                {Object.keys(countryLeagueMap).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* League Filter */}
            <div className="my-4 w-full">
              <h3 className="mb-4 text-center text-base font-bold text-[#000000] uppercase">
                League
              </h3>
              <select
                value={filters.league}
                onChange={(e) => handleChange("league", e.target.value)}
                className="block w-full p-2 border border-[#D0D0D0] rounded-lg bg-white outline-none"
              >
                <option value="">All</option>
                {availableLeagues.map((league) => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
            </div>

            {/* Titles Filter */}
            <div className="my-4 w-full">
              <h3 className="mb-4 text-center text-base font-bold text-[#000000] uppercase">
                Minimum Titles
              </h3>
              <input
                value={filters.titles}
                onChange={(e) => handleChange("titles", e.target.value)}
                className="block w-full p-2 border border-[#D0D0D0] rounded-lg bg-white outline-none"
              />
              {
                titlesErrorValue && <small className="text-xs text-red-500">
                  {titlesErrorValue}
                </small>
              }
            </div>

            {/* Colors Filter */}
            <div className="my-4 w-full">
              <h3 className="mb-4 text-center text-base font-bold text-[#000000] uppercase">
                Colors
              </h3>
              <div
                style={{
                  padding: 0,
                  margin: 0,
                  listStyle: "none",
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  columnGap: ".8rem",
                  rowGap: ".5rem",
                }}
              >
                {colors.map((color) => (
                  <label
                    key={color.color}
                    className={`pl-[15px] flex items-center mb-2 rounded-lg bg-white text-xs leading-[14px] min-h-[40px] w-full pointer justify-start gap-x-2 border-2  ${filters.colors?.includes(color.color)
                      ? "border-[#000000]"
                      : "border-transparent"
                      }
                      `}
                    style={{
                      boxShadow:
                        "0 4px 12px 0 #00000005, 0 1px 4px 0 #0000000a",
                    }}
                  >
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setFilters((prevFilters) => {
                          const newColors = e.target.checked
                            ? [...(prevFilters.colors || []), color.color]
                            : prevFilters.colors.filter(
                              (c) => c !== color.color
                            );
                          return { ...prevFilters, colors: newColors };
                        })
                      }
                      className="mr-2 hidden"
                    />
                    <span
                      style={{ backgroundColor: color.color }}
                      className="w-6 h-6 rounded-full border"
                    ></span>
                    <span>{color.value}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Foundation Year Filter */}
            <div className="my-4 w-full">
              <h3 className="mb-4 text-center text-base font-bold text-[#000000] uppercase">
                Foundation Year
              </h3>
              <div className="flex space-x-4">
                <input
                  placeholder="Min Year"
                  value={filters.minFoundationYear || minYear}
                  onChange={(e) =>
                    handleChange("minFoundationYear", e.target.value)
                  }
                  disabled
                  className="w-1/2 p-2 border border-[#D0D0D0] rounded-lg bg-[rgba(239, 239, 239, 0.3)] outline-none"
                />
                <input
                  placeholder="Max Year"
                  value={filters.maxFoundationYear || maxYear}
                  onChange={(e) =>
                    handleChange("maxFoundationYear", e.target.value)
                  }
                  disabled
                  className="bg-[rgba(239, 239, 239, 0.3)] w-1/2 block p-2 border border-[#D0D0D0] rounded-lg outline-none"
                />
              </div>
              <Slider
                range
                min={minYear}
                max={maxYear}
                defaultValue={[
                  filters.minFoundationYear || minYear,
                  filters.maxFoundationYear || maxYear,
                ]}
                onChangeComplete={handleSliderChange}
                className="mt-4"
                trackStyle={[{ backgroundColor: "#003A63" }]}
                handleStyle={[
                  { borderColor: "#003A63", backgroundColor: "#003A63" },
                  { borderColor: "#003A63", backgroundColor: "#003A63" },
                ]}
              />
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-[#F8F8F8] px-6 py-3">
            <button
              className="flex h-[39px] w-[193px] items-center justify-center text-sm font-medium text-[#000000]"
              onClick={clearFilters}
            >
              <span className="Icons_v2_geral-iv2-icon_clean font-icons text-[2.125rem] leading-[2.5rem]"></span>
              <span>Clear All</span>
            </button>
            <button
              className={`flex h-[39px] w-[193px] items-center justify-center bg-[#003A63] text-sm font-medium text-[#FFFFFF] ${titlesErrorValue ? "opacity-30": "opacity-100"}`}
              onClick={handleFilterSubmit}
              disabled={titlesErrorValue}
              style={{
                boxShadow:
                  "0px 1px 2px 1px #00000026 border border-[#999999] rounded-sm",
              }}
            >
              <span className="Icons_v2_geral-iv2-icon_filter font-icons text-[2.125rem] leading-[2.5rem]"></span>
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterDrawer;
