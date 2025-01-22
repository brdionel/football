import React, { useState } from "react";
import { useTable } from "react-table";
import Map from "./Map";
import { GrLocation } from "react-icons/gr";

const Table = ({ data, columns }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const openLocationModal = (location) => {
    setSelectedLocation(location);
    setModalOpen(true);
  };

  const closeLocationModal = () => {
    setModalOpen(false);
    setSelectedLocation(null);
  };

  return (
    <div className="rounded-lg overflow-x-auto border-gray-200 ">
      <table className="text-center min-w-full bg-white" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()} className="">
              {headerGroup.headers.map((column, index) => (
                <th
                  key={index}
                  {...column.getHeaderProps()}
                  className="p-4 text-[12px] leading-[22px] font-semibold text-[#666767]"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                key={index}
                {...row.getRowProps()}
                className="bg-white rounded-lg shadow-sm my-1"
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={index}
                    {...cell.getCellProps()}
                    className="p-4 text-[12px] leading-[22px] text-[#2E373D] border-r last:border-r-0 "
                  >
                    {cell.column.id === "badge" ? (
                      <img
                        src={cell.value}
                        alt={`${row.original.name} Badge`}
                        className="w-10 h-10 object-contain mx-auto"
                      />
                    ) : cell.column.id === "colors" ? (
                      row.original.colors.length === 2 ? (
                        <div
                          className="mx-auto w-7 h-7 rounded-full shadow-2xl border"
                          style={{
                            background: `conic-gradient(${row.original.colors[0]} 50%, ${row.original.colors[1]} 50%)`,
                          }}
                        />
                      ) : (
                        <span>No color data</span>
                      )
                    ) : cell.column.id === "location" ? (
                      <button
                        className="px-4 py-2 rounded"
                        onClick={() => openLocationModal(row.original.location)}
                      >
                        <GrLocation className="size-[24px]" />
                      </button>
                    ) : (
                      cell.render("Cell")
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal para mostrar el mapa */}
      {modalOpen && selectedLocation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-1/2 animate-fade-up">
            <h2 className="text-xl font-bold mb-4">Team Location</h2>
            <Map location={selectedLocation} />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={closeLocationModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
