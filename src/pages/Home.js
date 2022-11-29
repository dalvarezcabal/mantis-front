import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as jsonexport from "jsonexport/dist";

function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const DATA_URL = process.env.REACT_APP_URL;

  const download = function (data) {
    // Creating a Blob for having a csv file format
    // and passing the data with type
    const blob = new Blob([data], { type: "text/csv" });

    // Creating an object for downloading url
    const url = window.URL.createObjectURL(blob);

    // Creating an anchor(a) tag of HTML
    const a = document.createElement("a");

    // Passing the blob downloading url
    a.setAttribute("href", url);

    // Setting the anchor tag attribute for downloading
    // and passing the download file name

    a.setAttribute(`download`, `mantis-reporte-${new Date().toLocaleDateString()}.csv`);

    // Performing a download with click
    a.click();
  };

  const handleExportCSV = () => {
    let exportToCsv = [];

    issues.forEach((data) => {
      exportToCsv.push({
        id: data.id,
        prioridad: data.priority.name,
        descripcion: data.description,
        asignado_a: data.handler ? data.handler.real_name : "Sin asignar",
        reportado_por: data.reporter.real_name,
        severidad: data.severity.name,
        estado: data.status.name,
        creado_el: data.created_at,
      });
    });

    jsonexport(exportToCsv, function (err, csv) {
      if (err) return console.error(err);
      download(csv);
      // console.log(csv);
    });
  };

  useEffect(() => {
    fetch(DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        setIssues(data.issues);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  if (loading) {
    return (
      <div className="container">
        <h1>Cargando datos...</h1>
      </div>
    );
  }
  return (
    <div className="container">
      <h1>
        Información de las incidencias <button onClick={() => handleExportCSV()}>Descargar CSV</button>
      </h1>

      <table id="xls" className="table table-bordered table-dark table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Prioridad</th>
            <th>Descripción</th>
            <th>Asignado a</th>
            <th>Severidad</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {issues.map((data) => {
            return (
              <tr key={data.id}>
                <td>{data.id}</td>
                <td>{data.priority.name}</td>
                <td>{data.description}</td>
                <td>{data.handler ? data.handler.name : "Sin asignar"}</td>
                <td>{data.severity.name}</td>
                <td>{data.status.name}</td>
                <td>
                  <Link to={"/issues/" + data.id}>Ver mas</Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
