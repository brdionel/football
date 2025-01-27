import "@testing-library/jest-dom";
import { render } from '@testing-library/react'
import Table from './Table'
import { useMemo } from 'react'

test("renders content", () => {
    const data = [
        {
            id: 1,
            name: "Manchester United",
            country: "England",
            league: "Premier League",
            titles: 20,
            founded: 1878,
            colors: ["#DA291C", "#FFFFFF"],
            badge: "https://api.promiedos.com.ar/images/team/baf/1",
            location: { lat: 53.4631, lng: -2.2913 },
        }
    ]

      const columns = [
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
        ]
       

    const component = render(<Table data={data} columns={columns} />)
})