import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.scss';
import Modal from './components/Modal';

const url = 'http://localhost:3042/flashcards';

function App() {
	const [flashcards, setFlashcards] = useState([]);
	const [fieldCategory, setFieldCategory] = useState('');
	const [fieldFront, setFieldFront] = useState('');
	const [fieldBack, setFieldBack] = useState('');
	const [addFlashcardModalVisibility, setAddFlashcardModalVisibility] = useState(false);

	const clearAddFlashcardModalFormValues = () => {
		setFieldCategory('');
		setFieldFront('');
		setFieldBack('');
	}

	const applyDefaultValues = (_flashcards) => {
		_flashcards.forEach((flashcard) => {
			flashcard.editing = false;
			flashcard.originalFlashcard = { ...flashcard };
		});
	};

	useEffect(() => {
		(async () => {
			const _flashcards = (await axios.get(url)).data;
			applyDefaultValues(_flashcards);
			setFlashcards(_flashcards);
		})();
	}, []);

	const handleFlashcardSave = (e) => {
		e.preventDefault();
		axios
			.post(url, {
				category: fieldCategory,
				front: fieldFront,
				back: fieldBack,
			})
			.then(function (response) {
				console.log(response);
				const _flashcard = response.data;
				const _flashcards = [...flashcards];
				_flashcards.push(_flashcard);
				setAddFlashcardModalVisibility(false);
				setFlashcards(_flashcards);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const handleDeleteButton = (e, flashcard) => {
		axios
			.delete(url + '/' + flashcard.id)
			.then(function (response) {
				console.log(response);
				const _flashcards = flashcards.filter(
					(m) => m.id !== flashcard.id
				);
				setFlashcards(_flashcards);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const handleSaveButton = (e, flashcard) => {
		flashcard.editing = !flashcard.editing;
		axios
			.put(url + '/' + flashcard.id, {
				category: flashcard.category,
				front: flashcard.front,
				back: flashcard.back,
			})
			.then(function (response) {
				console.log(response);
				applyDefaultValues(flashcards);
				setFlashcards([...flashcards]);
			})
			.catch(function (error) {
				console.log(error);
			});
	};

	const handleEditButton = (e, flashcard) => {
		flashcard.editing = !flashcard.editing;
		setFlashcards([...flashcards]);
	};

	const handleCancelButton = (e, flashcard) => {
		flashcard.category = flashcard.originalFlashcard.category;
		flashcard.editing = !flashcard.editing;
		setFlashcards([...flashcards]);
	};

	const handleChangeCategory = (e, flashcard) => {
		flashcard.category = e.target.value;
		setFlashcards([...flashcards]);
	};

	const handleChangeFront = (e, flashcard) => {
		flashcard.front = e.target.value;
		setFlashcards([...flashcards]);
	};

	const handleChangeBack = (e, flashcard) => {
		flashcard.back = e.target.value;
		setFlashcards([...flashcards]);
	};

	return (
		<div className="App">
			<h1>Flashcards</h1>
			<p>There are {flashcards.length} flashcards.</p>

			<Modal buttonText="Add New Flashcard" addFlashcardModalVisibility={addFlashcardModalVisibility} setAddFlashcardModalVisibility={setAddFlashcardModalVisibility} clearAddFlashcardModalFormValues={clearAddFlashcardModalFormValues}>
				<h2>Add Flashcard</h2>
				<form className="modalContent">
					<div className="row">
						Category:{' '}
						<input
							value={fieldCategory}
							onChange={(e) => setFieldCategory(e.target.value)}
						/>
					</div>
					<div className="row">
						Front:{' '}
						<input
							value={fieldFront}
							onChange={(e) => setFieldFront(e.target.value)}
						/>
					</div>
					<div className="row">
						Back:{' '}
						<input
							value={fieldBack}
							onChange={(e) => setFieldBack(e.target.value)}
						/>
					</div>
					<div className="row">
						<button
							className="saveFlashcard"
							onClick={(e) => handleFlashcardSave(e)}
						>
							Save
						</button>
					</div>
				</form>
			</Modal>
			<div className="flashcards">
				{flashcards.map((flashcard, i) => {
					return (
						<div key={i} className="flashcard">
							{!flashcard.editing ? (
								<>
									<div className="category">
										{flashcard.category}
									</div>
									<div className="front">
										{flashcard.front}
									</div>
									<div className="back">{flashcard.back}</div>
									<div className="buttonArea">
										<button
											className="delete"
											onClick={(e) =>
												handleDeleteButton(e, flashcard)
											}
										>
											Delete
										</button>
										<button
											className="edit"
											onClick={(e) =>
												handleEditButton(e, flashcard)
											}
										>
											Edit
										</button>
									</div>
								</>
							) : (
								<>
									<div className="category">
										Category:{' '}
										<input
											value={flashcard.category}
											onChange={(e) =>
												handleChangeCategory(
													e,
													flashcard
												)
											}
										/>
									</div>
									<div className="front">
										Front:{' '}
										<input
											value={flashcard.front}
											onChange={(e) =>
												handleChangeFront(e, flashcard)
											}
										/>
									</div>
									<div className="back">
										Back:{' '}
										<input
											value={flashcard.back}
											onChange={(e) =>
												handleChangeBack(e, flashcard)
											}
										/>
									</div>
									<div className="buttonArea">
										<button
											className="saveEditFlashcard"
											onClick={(e) =>
												handleSaveButton(e, flashcard)
											}
										>
											Save
										</button>
										<button
											className="cancel"
											onClick={(e) =>
												handleCancelButton(e, flashcard)
											}
										>
											Cancel
										</button>
									</div>
								</>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default App;