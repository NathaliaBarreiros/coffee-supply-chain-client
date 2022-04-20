import React from "react";
import {
	Checkbox,
	FormControl,
	FormControlLabel,
	FormGroup,
	FormLabel,
	FormHelperText,
} from "@mui/material";
import { Field, ErrorMessage } from "formik";

const FormikCheckbox = ({
	name,
	label,
	legend,
	required = false,
	errorString,
}) => {
	return (
		<div>
			<FormControl fullWidth>
				<FormLabel required={required} component="legend">
					{legend}
				</FormLabel>
				<FormGroup>
					<FormControlLabel
						control={<Checkbox name={name} />}
						label={label}
						// errorstring={<ErrorMessage name={name} />}
					/>
					<FormHelperText>{errorString}</FormHelperText>
				</FormGroup>
			</FormControl>
		</div>
	);
};

// const FormikCheckbox = ({ name, label, legend, required = false }) => {
// 	return (
// 		<div>
// 			<Field
// 				name={name}
// 				as={MUICheckboxField}
// 				label={label}
// 				errorString={<ErrorMessage name={name} />}
// 				required={required}
// 				legend={legend}
// 			/>
// 		</div>
// 	);
// };

export default FormikCheckbox;
