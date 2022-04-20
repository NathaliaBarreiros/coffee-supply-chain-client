import React from "react";
import { TextField } from "@mui/material";
import { Field, ErrorMessage } from "formik";

const FormikField = ({ name, label, type = "text", required = false }) => {
	return (
		<div>
			<Field
				required={required}
				name={name}
				as={TextField}
				autoComplete="off"
				label={label}
				fullWidth
				type={type}
				helperText={<ErrorMessage name={name} />}
			/>
		</div>
	);
};

export default FormikField;
