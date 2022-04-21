import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const DateTimePicker = ({ name, ...otherProps }) => {
	const [field, meta] = useField(name);

	const configDateTimePicker = {
		...field,
		...otherProps,
		type: "date", //permite que sea de tipo date
		variant: "outlined",
		fullWidth: true,
		InputLabelProps: {
			shrink: true, //solo se hace en datetime picker para q no se muestre el label?
		},
	};

	if (meta && meta.touched && meta.error) {
		configDateTimePicker.error = true;
		configDateTimePicker.helperText = meta.error;
	}

	return <TextField {...configDateTimePicker} />;
};

export default DateTimePicker;
