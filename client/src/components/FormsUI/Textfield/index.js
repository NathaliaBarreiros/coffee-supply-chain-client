import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

const TextfieldWrapper = ({ name, ...otherProps }) => {
	const [field, meta] = useField(name); //hook from formik to make it aware of changes
	const configTextfield = {
		...field,
		...otherProps,
		fullWidth: true,
		variant: "outlined",
	};
	//error validation
	if (meta && meta.touched && meta.error) {
		configTextfield.error = true; //enable the error state
		configTextfield.helperText = meta.error; //define custom error msg within yup validation
	}
	return <TextField {...configTextfield} />;
};

export default TextfieldWrapper;
