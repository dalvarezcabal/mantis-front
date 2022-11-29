import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as jsonexport from "jsonexport/dist";
import MUIDataTable from "mui-datatables";
import axios from "axios";

function Home() {
	const [issues, setIssues] = useState([]);
	const [loading, setLoading] = useState(true);

	const DATA_URL = process.env.REACT_APP_URL;

	const columns = [
		{
			name: "id",
			label: "ID",
			options: {
				filter: true,
				sort: true,
			},
		},
		{
			name: "categoria",
			label: "Categoria",
			options: {
				display: false,
			},
		},
		{
			name: "proyecto",
			label: "Proyecto",

			options: {
				display: false,
			},
		},
		{
			name: "reproducible",
			label: "Reproducible",
			options: {
				display: false,
			},
		},
		{
			name: "resolucion",
			label: "Resolución",
			options: {
				display: false,
			},
		},
		{
			name: "prioridad",
			label: "Prioridad",
		},
		{
			name: "descripcion",
			label: "Descripción",
		},
		{
			name: "reportado_por",
			label: "Reportado por",
		},
		{
			name: "severidad",
			label: "Severidad",
		},
		{
			name: "estado",
			label: "Estado",
		},
		{
			name: "creado_el",
			label: "Creado el",
		},
		{
			name: "enlace",
			label: "Información",
			options: {
				customBodyRender: (value, tableMeta, updateValue) => {
					return (
						<Link to={"/issues/" + value}>
							<button type="button">¡Ver más!</button>
						</Link>
					);
				},
			},
		},
	];

	const BotonMagico = (props) => {
		return (
			<Link to={"/issues/" + props.value}>
				<button type="button">Click Me!</button>
			</Link>
		);
	};

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

		a.setAttribute(
			`download`,
			`mantis-reporte-${new Date().toLocaleDateString()}.csv`
		);

		// Performing a download with click
		a.click();
	};

	const handleExportCSV = () => {
		let exportToCsv = [];

		issues.forEach((data) => {
			console.log(data);
			exportToCsv.push({
				id: data.id,
				categoria: data.categoria,
				proyecto: data.proyecto,
				reproducible: data.reproducible,
				resolucion: data.resolucione,
				prioridad: data.prioridad,
				descripcion: data.descripcion,
				asignado_a: data.asignado_a,
				reportado_por: data.reportado_por,
				severidad: data.severidad,
				estado: data.estado,
				creado_el: data.creado_el,
			});
		});

		jsonexport(exportToCsv, function (err, csv) {
			if (err) return console.error(err);
			download(csv);
			// console.log(csv);
		});
	};

	const handleFetchAPI = async () => {
		await axios.get(DATA_URL).then((response) => {
			const data = response.data;
			let refactorData = [];

			data.issues.forEach((data) => {
				refactorData.push({
					id: data.id,
					categoria: data.category.name,
					proyecto: data.project.name,
					reproducible: data.reproducibility.name,
					resolucion: data.resolution.name,
					prioridad: data.priority.name,
					descripcion: data.description,
					asignado_a: data.handler ? data.handler.real_name : "Sin asignar",
					reportado_por: data.reporter.real_name ?? data.reporter.name,
					severidad: data.severity.name,
					estado: data.status.name,
					creado_el: data.created_at,
					enlace: data.id,
				});
			});

			setIssues(refactorData);
		});
	};

	const options = {
		filterType: "checkbox",
		fixedHeader: true,
		// sort: false,
		resizableColumns: true,
		draggableColumns: {
			enabled: true,
		},
		tableBodyHeight: "400px",
		downloadOptions: {
			filename: "mantis-table.csv",
			separator: ",",
			filterOptions: {
				useDisplayedColumnsOnly: true,
				useDisplayedRowsOnly: true,
			},
		},
		selectToolbarPlacement: "above",
	};

	useEffect(() => {
		handleFetchAPI();
	}, [loading]);

	return (
		<div className="container">
			<h1>
				Información de las incidencias{" "}
				<button onClick={() => handleExportCSV()}>Descargar CSV</button>
			</h1>
			<MUIDataTable
				title={"Mantis API"}
				data={issues}
				columns={columns}
				options={options}
			/>
		</div>
	);
}

export default Home;
