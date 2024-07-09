/** @format */

import ChessGame from './Components/ChessGame';

function App() {
	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
			<h1 className='text-3xl font-bold mb-6'>Chess Game vs Computer</h1>
			<ChessGame />
		</div>
	);
}

export default App;
