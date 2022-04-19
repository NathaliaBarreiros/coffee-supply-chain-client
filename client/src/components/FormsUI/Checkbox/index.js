import React from "react";
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
} from "@mui/material";
import { useField, useFormikContext } from "formik";

const CheckboxWrapper = ({ name, label, legend, ...otherProps }) => {
	const { setFieldValue } = useFormikContext();

	const [field, meta] = useField(name);

	const handleChange = (evt) => {
		const { checked } = evt.target; //checked es un valor boolean
		setFieldValue(name, checked);
	};

	const configCheckbox = {
		...field,
		...otherProps,
		onChange: handleChange,
	};

	//como checkbox no tiene un prop for error necesito usar FormControl
	const configFormControl = {};

	if (meta && meta.touched && meta.error) {
		configFormControl.error = true;
	}

	return (
		<FormControl {...configFormControl}>
			<FormLabel component="legend">{legend}</FormLabel>
			<FormGroup>
				<FormControlLabel
					control={<Checkbox {...configCheckbox} />}
					label={label}
				/>
			</FormGroup>
		</FormControl>
	);
};

export default CheckboxWrapper;
