import React, { useState } from "react";
import { useTable } from "react-table";
import Map from "./Map";
import { GrFormClose, GrLocation } from "react-icons/gr";
import NotFound from "./icons/notFound";

const Table = ({ changeSorting, data, columns }) => {
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

  if (data.length === 0) return (
    <div className="text-center p-4 bg-white rounded-lg shadow-sm my-1 flex items-center justify-center md:gap-4"> 
      <NotFound className={"hidden md:block"}/>
      <span>There are no teams that match your search</span>
    </div>
  )


  return (
    <div className="rounded-lg overflow-x-auto border-gray-200 ">

      <table className="text-center min-w-full bg-white" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => {
            const { key, ...restProps } = headerGroup.getHeaderGroupProps()
            return (
              <tr key={key} {...restProps} className="">
                {headerGroup.headers.map((column) => {
                  const { key, ...restProps } = column.getHeaderProps()
                  return (
                    <th
                      key={key}
                      {...restProps}
                      className="p-4 text-[12px] leading-[22px] font-semibold text-[#666767] cursor-pointer"
                      onClick={() => changeSorting(column.id)}
                    >
                      {column.render("Header")}
                    </th>
                  )
                })}
              </tr>
            )
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                className="bg-white rounded-lg shadow-sm my-1"
              >
                {row.cells.map((cell) => {
                  const { key, ...restProps } = cell.getCellProps()
                  return (
                    <td
                      key={key}
                      {...restProps}
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
                  )
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal para mostrar el mapa */}
      {modalOpen && selectedLocation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-[90%] md:w-1/2 animate-fade-up">
            <header className="flex items-center justify-between pb-2">
              <h2 className="text-xl font-bold mb-4">Team Location</h2>
              <button
                onClick={closeLocationModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <GrFormClose className="size-[34px]" />
              </button>
            </header>
            <Map location={selectedLocation} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
