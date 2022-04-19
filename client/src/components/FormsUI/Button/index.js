import React from "react";
import { Button } from "@mui/material";
import { useFormikContext } from "formik"; //se usa cuando tengo un elemento que cambia: boton, checkbox, select para que se actualice con formik

const ButtonWrapper = ({ children, ...otherProps }) => {
	const { submitForm } = useFormikContext();

	const handleSubmit = () => {
		submitForm();
	};

	const configButton = {
		...otherProps,
		variant: "contained",
		color: "primary",
		fullWidth: true,
		onClick: handleSubmit,
	};

	return <Button {...configButton}>{children}</Button>;
};

export default ButtonWrapper;
