import { useEffect, useState } from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
	background: rgba(100, 100, 100, 0.8);
	position: fixed;
	z-index: 1;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
`;

const ModalBody = styled.div`
	background: rgba(255, 255, 255, 1);
	margin: 10% auto;
	padding: 20px;
	width: 50%;
	border-radius: 5px;
	z-index: 2;
	.closeButton {
		float: right;
	}
`;

const Modal = ({
	children,
	buttonText,
	addFlashcardModalVisibility,
	setAddFlashcardModalVisibility,
	clearAddFlashcardModalFormValues,
}) => {
	const handleCloseModal = () => {
		clearAddFlashcardModalFormValues();
		setAddFlashcardModalVisibility(false);
	};

	return (
		<div className="modal">
			<button onClick={() => setAddFlashcardModalVisibility(true)}>
				{buttonText}
			</button>

			{addFlashcardModalVisibility && (
				<ModalBackground
					onClick={() => setAddFlashcardModalVisibility(false)}
				>
					<ModalBody onClick={(e) => e.stopPropagation()}>
						<button
							className="closeButton"
							onClick={() => handleCloseModal()}
						>
							X
						</button>
						{children}
					</ModalBody>
				</ModalBackground>
			)}
		</div>
	);
};

export default Modal;