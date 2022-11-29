import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Swal from "sweetalert2";

function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(true);

  const params = useParams();

  const DATA_URL = `${process.env.REACT_APP_URL}/issue/${params.id}`;
  const DATA_URL_POST = `${process.env.REACT_APP_URL}/${params.id}`;
  const DATA_URL_STATUS = `${process.env.REACT_APP_URL}/statusList`;

  const getListOfStatus = async () => {
    let listOfStatus = [];
    const response = await fetch(DATA_URL_STATUS);
    const data = await response.json();

    data.configs[0].value.forEach((element) => {
      listOfStatus.push({
        name: element.name,
        label: element.label,
      });
    });

    return listOfStatus;
    // setStatusList(data.configs.value);
  };

  const handleStatusData = async () => {
    let listStatus = await getListOfStatus();
    let options = {};
    listStatus.forEach((o) => {
      options[o.name] = o.label;
    });

    const { value: status } = await Swal.fire({
      title: "Elige un nuevo estado",
      input: "select",
      inputOptions: options,
      inputPlaceholder: "Elige un estado",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "¡Tienes que elegir un estado!";
        }
      },
    });

    if (status) {
      fetch(DATA_URL_POST, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          status: {
            name: status,
          },
        }),
      })
        .then((response) => {
          setUpdated(false);
          Swal.fire("¡Se ha cambiado el estado de la incidencia!");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  const handleInputData = async () => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Nueva nota",
      inputPlaceholder: "Escribe tu nota aquí...",
      inputAttributes: {
        "aria-label": "Escribe tu nota aquí...",
      },
      inputValidator: (value) => {
        if (!value) {
          return "¡Tienes que escribir una nota!";
        }
      },
      showCancelButton: true,
    });

    if (text) {
      fetch(DATA_URL_POST, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          text: text,
          view_state: {
            name: "public",
          },
        }),
      })
        .then((response) => {
          setUpdated(false);
          Swal.fire("¡Nueva nota añadida!");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  useEffect(() => {
    fetch(DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.issues);
        setIssues(data.issues);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setUpdated(true);
  }, [updated]);

  if (loading) {
    return (
      <div className="container">
        <h1>Cargando datos...</h1>
      </div>
    );
  }
  return (
    <div className="container">
      <h1>Información de la incidencia</h1>

      {issues.map((data) => {
        return (
          <div key={data.id} className="incidencia">
            <div className="incidencia-data">
              <div>ID</div>
              <div>{data.id}</div>
            </div>
            <div className="incidencia-data">
              <div>Prioridad</div>
              <div>{data.priority.name}</div>
            </div>
            <div className="incidencia-data">
              <div>Descripción</div>
              <div>{data.description}</div>
            </div>
            <div className="incidencia-data">
              <div>Asignado a</div>
              <div>{data.handler ? data.handler.name : "Sin asignar"}</div>
            </div>
            <div className="incidencia-data">
              <div>Severidad</div>
              <div>{data.severity.name}</div>
            </div>
            <div className="incidencia-data">
              <div>
                Estado <button onClick={handleStatusData}>Editar</button>
              </div>
              <div>{data.status.name}</div>
            </div>

            <h3>
              Notas: <button onClick={handleInputData}>+</button>
            </h3>
            {data.notes ? (
              data.notes.map((r) => {
                return (
                  <div key={r.id} className="incidencia-data">
                    <div>{r.id}</div>
                    <div>{r.text}</div>
                  </div>
                );
              })
            ) : (
              <p>No hay notas disponibles</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Home;
