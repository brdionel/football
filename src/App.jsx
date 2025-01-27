// 4️⃣ App.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Table from "./components/Table";
import FilterDrawer from "./components/FilterDrawer";
import { countryLeagueMap, data, maxYear, minYear, SortBy } from "./constants";
import { MdKeyboardArrowUp } from "react-icons/md";

const App = () => {
  const lastList = useRef(data)
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
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

  const [availableLeagues, setAvailableLeagues] = useState([]);
  useEffect(() => {
    if (filters.country === "") {
      const nestedLeagues = Object.values(countryLeagueMap);
      const flatNestedLeaguas = nestedLeagues.flat()
      setAvailableLeagues(flatNestedLeaguas)
    }
  }, [filters.country])

  const clearFilters = () => {
    const currentSearch = new URLSearchParams(window.location.search).get('search') || '';

    setFilters({
      country: "",
      league: "",
      titles: "",
      colors: [],
      minFoundationYear: minYear,
      maxFoundationYear: maxYear,
    });
    
    if (currentSearch) {
      navigate(`/?search=${currentSearch}`);
    } else {
      navigate(`/`);
    }
    setOpen(false);
    //setFilteredData(data);

  };

  const clearSearch = (e) => {
    e.stopPropagation()
    if (search.trim().length > 0) {
      setSearch("");
      // Obtener los parámetros actuales de la URL
      const params = new URLSearchParams(location.search);

      // Eliminar el parámetro 'search'
      params.delete("search");

      // Actualizar la URL sin el parámetro 'search'
      navigate({
        pathname: location.pathname, // Mantener la misma ruta
        search: params.toString(), // Aplicar los parámetros modificados
      });
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
      })
    });
  };

  const buildUrlWithFilters = filters => {
    const queryParams = new URLSearchParams();

    for (const key in filters) {
      if (filters[key]) {
        const value = filters[key];

        if (
          (key === "minFoundationYear" && value === 1850) ||
          (key === "maxFoundationYear" && value === new Date().getFullYear())
        ) {
          continue; // Saltar si los valores son iguales a los iniciales
        }

        if (Array.isArray(value)) {
          if (value.length > 0) {
            const formattedValues = value.map(item => item).join(",");
            queryParams.append(key, formattedValues);
          }
        } else {
          queryParams.append(key, filters[key]);
        }
      }
    }

    return `/?${queryParams.toString()}`;
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

    const queryString = buildUrlWithFilters({
      country: filters.country,
      league: filters.league,
      titles: filters.titles,
      colors: filters.colors,
      minFoundationYear: filters.minFoundationYear,
      maxFoundationYear: filters.maxFoundationYear,
      search: search
    });

    navigate(`${queryString}`);
    setOpen(false);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault()

    // Crear una copia de los parámetros actuales
    const params = new URLSearchParams(searchParams);

    // Agregar o actualizar el parámetro de búsqueda
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search"); // Eliminar si el valor es vacío
    }

    // Navegar a la nueva URL con los parámetros actualizados
    navigate(`?${params.toString()}`);
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

    if (search) {
      sortedData = sortedData.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase()) // Filtro por el nombre del equipo
      );
    }

    if ([SortBy.BADGE, SortBy.COLORS, SortBy.LOCATION].includes(sorting)) {
      return lastList.current;
    }

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

    lastList.current = sortedData;
    return sortedData;
  }, [filteredData, sorting, sortOrder]);

  useEffect(() => {
    const scrollToTopButton = document.getElementById("scroll-to-top");

    // Mostrar/ocultar el botón dependiendo del scroll
    window.addEventListener("scroll", () => {
      if (window.scrollY > 200) { // Aparece si haces scroll más de 200px
        scrollToTopButton.classList.remove("hidden");
        scrollToTopButton.classList.add("flex");
      } else {
        scrollToTopButton.classList.add("hidden");
        scrollToTopButton.classList.remove("flex");
      }
    });
  })

  const handleChange = (key, value) => {
    if (key === "country") {
      setFilters((prev) => ({
        ...prev,
        country: value,
        league: "",
      }));
      setAvailableLeagues(countryLeagueMap[value] || []);
    } else if (key === "league") {
      const country = Object.keys(countryLeagueMap).find((item) =>
        countryLeagueMap[item].includes(value)
      );
      setFilters((prev) => ({
        ...prev,
        league: value,
        country: country || "",
      }));
    } else if (key === "titles") {
      setFilters((prev) => ({
        ...prev,
        titles: value
      }));

      if (value.trim() === "") {
        setTitlesErrorValue(null);
        setFilters((prev) => ({
          ...prev,
          titles: "", // Resetea el filtro si está vacío
        }));
        return;
      }

      // Si no es un número, se muestra el error.
      if (isNaN(value)) {
        setTitlesErrorValue("The value must be a number");
        return;
      }

      // Si el valor es negativo, muestra el error.
      if (value < 0) {
        setTitlesErrorValue("The value must be greater than or equal to 0");
        return;
      }

      // Si pasa las validaciones, limpia el error y guarda el valor.
      setTitlesErrorValue(null);

    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSliderChange = ([min, max]) => {
    setFilters((prev) => ({
      ...prev,
      minFoundationYear: min,
      maxFoundationYear: max,
    }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {};

    const searchQuery = params.get("search") || "";
    setSearch(searchQuery);

    for (let [key, value] of params.entries()) {
      if (key !== "search") {
        if (key === "colors") {
          // Manejar 'colors' como array
          newFilters[key] = value.includes(",")
            ? value.split(",") // Múltiples colores
            : [value]; // Un solo color
        } else {
          // Asignar directamente para los demás filtros
          newFilters[key] = value;
        }
      }
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      country: newFilters.country || "",
      league: newFilters.league || "",
      titles: newFilters.titles || "",
      colors: newFilters.colors || [], // Ahora es siempre un array
      minFoundationYear: newFilters.minFoundationYear || 1850,
      maxFoundationYear: newFilters.maxFoundationYear || new Date().getFullYear(),
    }));

    const result = data.filter((team) => {
      // Valores por defecto si no hay filtros activos
      const byCountry = newFilters.country
        ? team.country === newFilters.country
        : true;

      const byLeague = newFilters.league
        ? team.league === newFilters.league
        : true;

      const byTitles = newFilters.titles
        ? team.titles >= Number(newFilters.titles)
        : true;

      const byColors = newFilters.colors?.length > 0
        ? newFilters.colors.some((color) => team.colors.includes(color))
        : true;

      const byFoundationYear =
        team.founded >= (newFilters.minFoundationYear || 1850) &&
        team.founded <= (newFilters.maxFoundationYear || new Date().getFullYear());

      return byCountry && byLeague && byTitles && byColors && byFoundationYear;
    });

    // Si no hay parámetros, mostrar todos los datos
    if (!params.entries().next().done) {
      setFilteredData(result);
    } else {
      setFilteredData(data); // Mostrar todos los datos si no hay filtros
    }

  }, [location.search])

  return (
    <div className="p-2 md:p-6 relative">
      <header className="px-4 md:px-8 ">
        <Link to="/">
          <h1 className="flex gap-x-4 items-center text-2xl">
            <img src={"/favicon2.png"} alt="logo pelota" className="max-w-full w-[50px] object-cover" />
            Football
          </h1>
        </Link>
      </header>
      <div className="p-4 md:p-8">
        <FilterDrawer
          availableLeagues={availableLeagues}
          clearFilters={clearFilters}
          clearSearch={clearSearch}
          filters={filters}
          setFilters={setFilters}
          handleChange={handleChange}
          handleChangeSearch={handleChangeSearch}
          handleFilterSubmit={handleFilterSubmit}
          handleSliderChange={handleSliderChange}
          handleSubmitSearch={handleSubmitSearch}
          open={open}
          search={search}
          setOpen={setOpen}
        />
        <Table changeSorting={handleChangeSort} data={sortedTimes} columns={columns} />
      </div>

      <button
        id="scroll-to-top"
        className="hidden fixed bottom-10 right-5 p-[.1rem] flex-col justify-center items-center shadow-lg cursor-pointer z-50 size-[40px] rotate-45 transform text-base font-semibold bg-[#2e373d] rounded-[10px]"
        onClick={() => {
          window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <span className="flex flex-col items-center rotate-[-45deg] transform text-white">
          <MdKeyboardArrowUp className="size-4" />
          <img src="/favicon2.png" alt="logo pelota" className="max-w-full w-[16px] object-cover" />
        </span>
      </button>

    </div>
  );
};

export default App;
