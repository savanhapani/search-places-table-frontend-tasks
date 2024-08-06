import React from "react";
import "../App.css";
export default function Table({ places }) {
  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Place Name</th>
          <th>Country</th>
        </tr>
      </thead>
      <tbody>
        {places.length === 0 ? (
          <tr>
            <td colSpan={3}>No result found</td>
          </tr>
        ) : (
          places.map((place, index) => (
            <tr key={place.id}>
              <td>{index + 1}</td>
              <td>{place.name}</td>
              <td>
                <img
                  src={`https://flagsapi.com/${place.countryCode}/shiny/32.png`}
                  alt={place.country}
                />
                {place.country}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
