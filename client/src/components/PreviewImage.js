import React, { useState } from "react";

const PreviewImage = ({ file, width, height }) => {
	const [preview, setPreview] = useState(null);

	const reader = new FileReader();

	reader.readAsDataURL(file);

	reader.onload = () => {
		setPreview(reader.result);
	};

	return (
		<div className="text-center">
			<img src={preview} alt="Preview" width={width} height={height} />
		</div>
	);
};

export default PreviewImage;
