import React from "react";
import {
	InputLabel,
	MenuItem,
	FormHelperText,
	FormControl,
	Select,
} from "@mui/material";
import { Field, ErrorMessage } from "formik";

const MUISelectField = ({
	errorString,
	label,
	children,
	value,
	name,
	onChange,
	onBlur,
	required,
}) => {
	return (
		<FormControl fullWidth>
			<InputLabel required={required}>{label}</InputLabel>
			<Select name={name} onChange={onChange} onBlur={onBlur} value={value}>
				{children}
			</Select>
			<FormHelperText>{errorString}</FormHelperText>
		</FormControl>
	);
};

const FormikSelect = ({ name, items, label, required = false }) => {
	return (
		<div>
			<Field
				name={name}
				as={MUISelectField}
				label={label}
				errorString={<ErrorMessage name={name} />}
				required={required}
			>
				{items.map((item) => (
					<MenuItem key={item.value} value={item.value}>
						{item.label}
					</MenuItem>
				))}
			</Field>
		</div>
	);
};

export default FormikSelect;
