// 4️⃣ App.jsx
import { useMemo, useState } from "react";
import Table from "./components/Table";
import FilterDrawer from "./components/FilterDrawer";
import { data, maxYear, minYear, SortBy } from "./constants";

const App = () => {
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({
    country: "",
    league: "",
    titles: "",
    colors: [],
    minFoundationYear: 1850,
    maxFoundationYear: new Date().getFullYear(),
  });
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState(SortBy.NONE);
  const [sortOrder, setSortOrder] = useState({
    name: 'desc',
    country: 'desc',
    league: 'desc',
    founded: 'desc',
    titles: 'desc',
  });

  const clearFilters = () => {
    setFilters({
      country: "",
      league: "",
      titles: "",
      colors: [],
      minFoundationYear: minYear,
      maxFoundationYear: maxYear,
    });
    setOpen(false);
    setFilteredData(data);
  };

  const clearSearch = () => {
    if (search.trim().length > 0) {
      setSearch("");
      setFilteredData(data);
    }
  };

  const handleChangeSearch = (value) => {
    setSearch(value);
  };

  const handleChangeSort = (sort) => {
    if ([SortBy.NONE, SortBy.BADGE, SortBy.COLORS, SortBy.LOCATION].includes(sort)) {
      return setSorting(sort);
    }
    setSorting(sort)
    setSortOrder((prev) => {
      return ({
      ...prev,
      [sort]: prev[sort] === 'asc' ? 'desc' : 'asc',
    })});
  };

  const handleFilterSubmit = () => {
    const result = data.filter((team) => {
      const byCountry = filters.country
        ? team.country === filters.country
        : true;

      const byLeague = filters.league ? team.league === filters.league : true;
      const byTitles = filters.titles ? team.titles >= Number(filters.titles) : true;
      const byColors =
        filters.colors.length > 0
          ? filters.colors.some((color) => team.colors.includes(color)) // `color` es el código hexadecimal ahora
          : true;
      const byFoundationYear =
        team.founded >= filters.minFoundationYear &&
        team.founded <= filters.maxFoundationYear;

      return byCountry && byLeague && byTitles && byColors && byFoundationYear;
    });

    setFilteredData(result);
    setOpen(false);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const result = filteredData.filter((team) => {
      return team.name.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredData(result);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Crest",
        accessor: "badge",
      },
      {
        Header: "Country",
        accessor: "country",
      },
      {
        Header: "League",
        accessor: "league",
      },
      {
        Header: "Year Founded",
        accessor: "founded"
      },
      {
        Header: "Titles",
        accessor: "titles",
      },
      {
        Header: "Colors",
        accessor: "colors",
      },
      {
        Header: "",
        accessor: "location", // Add the location column
        Cell: ({ value }) => (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => openLocationModal(value)} // Function to open the modal
          >
            View Location
          </button>
        ),
      },
    ],
    []
  );

  const sortedTimes = useMemo(() => {
    let sortedData = filteredData;

    if ([SortBy.NONE, SortBy.BADGE, SortBy.COLORS, SortBy.LOCATION].includes(sorting)) return sortedData;

    if (sorting === SortBy.NAME) {
      sortedData = sortedData.toSorted((a, b) => a.name.localeCompare(b.name));
    }
    if (sorting === SortBy.COUNTRY) {
      sortedData = sortedData.toSorted((a, b) => a.country.localeCompare(b.country));
    }
    if (sorting === SortBy.LEAGUE) {
      sortedData = sortedData.toSorted((a, b) => a.league.localeCompare(b.league));
    }
    if (sorting === SortBy.FOUNDED) {
      sortedData = sortedData.toSorted((a, b) => a.founded - b.founded);
    }
    if (sorting === SortBy.TITLES) {
      sortedData = sortedData.toSorted((a, b) => a.titles - b.titles);
    }

    // Cambia el orden dependiendo de `sortOrder`
    if (sortOrder[sorting] === 'desc') {
      sortedData = sortedData.reverse();
    }

    console.log("Filtered data for sorting:", sortedData.map((team) => team.country));

    return sortedData;
  }, [filteredData, sorting, sortOrder]);

  return (
    <div className="p-2 md:p-6">
      <header className="px-4 md:px-8 ">
        <h1 className="flex gap-x-4 items-center text-2xl">
          <img src={"/favicon2.png"} alt="logo pelota" className="max-w-full w-[50px] object-cover" />
          Football
        </h1>
      </header>
      <div className="p-4 md:p-8">
        <FilterDrawer
          clearFilters={clearFilters}
          clearSearch={clearSearch}
          filters={filters}
          setFilters={setFilters}
          handleChangeSearch={handleChangeSearch}
          handleFilterSubmit={handleFilterSubmit}
          handleSubmitSearch={handleSubmitSearch}
          open={open}
          search={search}
          setOpen={setOpen}
        />
        <Table changeSorting={handleChangeSort} data={sortedTimes} columns={columns} />
      </div>
    </div>
  );
};

export default App;
