import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { useField, useFormikContext } from "formik";

//options -> custom options, se pasa como un objeto
const SelectWrapper = ({ name, options, ...otherProps }) => {
	const { setFieldValue } = useFormikContext(); //setfieldvalue function permite actualizar el form state dentro del componente

	const [field, meta] = useField(name);

	const handleChange = (evt) => {
		const { value } = evt.target;
		setFieldValue(name, value); //actualiza el formik state
	};
	const configSelect = {
		...field,
		...otherProps,
		select: true, //porque es un componente select
		variant: "outlined",
		fullWidth: true,
		onChange: handleChange, //necesito este handler para desestructurar el value del event.target
		//permite actualizar el valor dentro de formik
	};

	//error validation
	if (meta && meta.touched && meta.error) {
		configSelect.error = true; //sale el error en rojo
		configSelect.helperText = meta.error;
	}

	return (
		<TextField {...configSelect}>
			{Object.keys(options).map((item, pos) => {
				return (
					<MenuItem key={pos} value={item}>
						{options[item]}
					</MenuItem>
				);
			})}
		</TextField>
	);
};

export default SelectWrapper;
