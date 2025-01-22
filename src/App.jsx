// 4️⃣ App.jsx
import { useMemo, useState } from "react";
import Table from "./components/Table";
import FilterDrawer, { maxYear, minYear } from "./components/FilterDrawer";

const data = [
  {
    id: 1,
    name: "Manchester United",
    country: "England",
    league: "Premier League",
    titles: 20,
    founded: 1878,
    colors: ["#DA291C", "#F1C1C1"],
    badge: "https://api.promiedos.com.ar/images/team/baf/1",
    location: { lat: 53.4631, lng: -2.2913 },
  },
  {
    id: 2,
    name: "Manchester City",
    country: "England",
    league: "Premier League",
    titles: 9,
    founded: 1880,
    colors: ["#6CABDD", "#FFFFFF"],
    badge: "https://api.promiedos.com.ar/images/team/bba/1",
    location: { lat: 53.483, lng: -2.2 },
  },
  {
    id: 3,
    name: "Liverpool",
    country: "England",
    league: "Premier League",
    titles: 19,
    founded: 1892,
    colors: ["#C8102E", "#00A9E0"],
    badge: "https://api.promiedos.com.ar/images/team/bai/1",
    location: { lat: 53.4308, lng: -2.9608 },
  },
  {
    id: 4,
    name: "Leeds United",
    country: "England",
    league: "Premier League",
    titles: 3,
    founded: 1919,
    colors: ["#003A63", "#F0F0F0"],
    badge: "https://api.promiedos.com.ar/images/team/dg/1",
    location: { lat: 53.7797, lng: -1.5217 },
  },
  {
    id: 5,
    name: "Napoli",
    country: "Italy",
    league: "Serie A",
    titles: 3,
    founded: 1926,
    colors: ["#0000FF", "#FFFFFF"],
    badge: "https://api.promiedos.com.ar/images/team/cde/1",
    location: { lat: 40.8533, lng: 14.305 },
  },
  {
    id: 6,
    name: "Roma",
    country: "Italy",
    league: "Serie A",
    titles: 3,
    founded: 1927,
    colors: ["#9B1B30", "#FDBF30"],
    badge: "https://api.promiedos.com.ar/images/team/ccf/1",
    location: { lat: 41.9028, lng: 12.4534 },
  },
  {
    id: 7,
    name: "Borussia Dortmund",
    country: "Germany",
    league: "Bundesliga",
    titles: 5,
    founded: 1909,
    colors: ["#FFDD00", "#000000"],
    badge: "https://api.promiedos.com.ar/images/team/deb/1",
    location: { lat: 51.4925, lng: 7.453 },
  },
  {
    id: 8,
    name: "Flamengo",
    country: "Brazil",
    league: "Brasileirão",
    titles: 7,
    founded: 1895,
    colors: ["#FF0000", "#000000"],
    badge: "https://api.promiedos.com.ar/images/team/bcbf/1",
    location: { lat: -22.9103, lng: -43.22 },
  },
  {
    id: 9,
    name: "Vasco da Gama",
    country: "Brazil",
    league: "Brasileirão",
    titles: 4,
    founded: 1898,
    colors: ["#003F87", "#FFFFFF"],
    badge: "https://api.promiedos.com.ar/images/team/bcch/1",
    location: { lat: -22.9101, lng: -43.1765 },
  },
  {
    id: 10,
    name: "Belgrano de Córdoba",
    country: "Argentina",
    league: "Primera División",
    titles: 0,
    founded: 1905,
    colors: ["#8B1C3F", "#F4D03F"],
    badge: "https://api.promiedos.com.ar/images/team/fhid/1",
    location: { lat: -31.413, lng: -64.181 },
  },
  {
    id: 11,
    name: "Talleres",
    country: "Argentina",
    league: "Primera División",
    titles: 0,
    founded: 1913,
    colors: ["#004F98", "#FFFFFF"],
    badge: "https://api.promiedos.com.ar/images/team/jche/1",
    location: { lat: -31.4037, lng: -64.1937 },
  },
  {
    id: 12,
    name: "Atlético Nacional",
    country: "Colombia",
    league: "Categoría Primera A",
    titles: 16,
    founded: 1947,
    colors: ["#0B6623", "#FFFFFF"],
    badge: "https://api.promiedos.com.ar/images/team/igea/1",
    location: { lat: 6.2419, lng: -75.574 },
  },
  {
    id: 13,
    name: "Millonarios de Bogotá",
    country: "Colombia",
    league: "Categoría Primera A",
    titles: 15,
    founded: 1946,
    colors: ["#0060A9", "#FFFFFF"],
    badge: "https://api.promiedos.com.ar/images/team/igdh/1",
    location: { lat: 4.607, lng: -74.0756 },
  },
  {
    id: 14,
    name: "Corinthians",
    country: "Brazil",
    league: "Brasileirão",
    titles: 7,
    founded: 1910,
    colors: ["#000000", "#FFFFFF"],
    badge: "https://api.promiedos.com.ar/images/team/bcgh/1",
    location: { lat: -23.534, lng: -46.462 },
  },
  {
    id: 15,
    name: "Real Madrid",
    country: "Spain",
    league: "La Liga",
    titles: 35,
    founded: 1902,
    colors: ["#FFFFFF", "#00529F"],
    badge: "https://api.promiedos.com.ar/images/team/bdb/1",
    location: { lat: 40.4531, lng: -3.6883 },
  },
  {
    id: 16,
    name: "Boca Juniors",
    country: "Argentina",
    league: "Primera División",
    titles: 34,
    founded: 1905,
    colors: ["#0000FF", "#FFD700"],
    badge: "https://api.promiedos.com.ar/images/team/igg/1",
    location: { lat: -34.6354, lng: -58.3645 },
  },
];

const App = () => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    league: "",
    titles: "",
    colors: [],
    minFoundationYear: 1850,
    maxFoundationYear: new Date().getFullYear(),
  });

  const [filteredData, setFilteredData] = useState(data);

  const [search, setSearch] = useState("");

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    const result = filteredData.filter((team) => {
      return team.name.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredData(result);
  };

  const handleChangeSearch = (value) => {
    setSearch(value);
  };

  const clearSearch = () => {
    setSearch("");
    setFilteredData(data);
  };

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

  // 🧪 Filtrar los equipos usando useMemo para optimizar el rendimiento
  const handleFilterSubmit = () => {
    console.log({ data });
    const result = data.filter((team) => {
      console.log({ team });
      const byCountry = filters.country
        ? team.country === filters.country
        : true;

      console.log("Pasa byCountry");
      const byLeague = filters.league ? team.league === filters.league : true;
      console.log("Pasa byLeague");
      const byTitles = filters.titles ? team.titles >= filters.titles : true;
      console.log("Pasa byTitle");
      const byColors =
        filters.colors.length > 0
          ? filters.colors.some((color) => team.colors.includes(color)) // `color` es el código hexadecimal ahora
          : true;
      console.log("Pasa byColors");
      const byFoundationYear =
        team.founded >= filters.minFoundationYear &&
        team.founded <= filters.maxFoundationYear;

      console.log("Pasa byFoundationYear -> ", { team, filters });
      console.log({
        byColors,
        byLeague,
        byTitles,
        byCountry,
        byFoundationYear,
      });
      return byCountry && byLeague && byTitles && byColors && byFoundationYear;
    });

    setFilteredData(result);
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
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
        Header: "Titles",
        accessor: "titles",
      },
      {
        Header: "Badge",
        accessor: "badge",
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

  return (
    <div className="p-2 md:p-6">
      <h1 className="text-3xl font-bold mb-6">World Football Stats</h1>
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
        <Table data={filteredData} columns={columns} />
      </div>
    </div>
  );
};

export default App;
