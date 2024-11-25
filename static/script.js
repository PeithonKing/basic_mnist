// Setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20; // Each cell is 10x10 pixels
const gridSize = 28; // 28x28 grid
let drawing = false;
let tool = 'pen'; // Default tool is 'pen'
let gridState = Array.from({ length: gridSize }, () => Array(gridSize).fill(1));
let plot;

// Initialize canvas grid
ctx.strokeStyle = '#999'; // Light gray for the grid
for (let x = 0; x <= gridSize; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, canvas.height);
    ctx.moveTo(0, x * cellSize);
    ctx.lineTo(canvas.width, x * cellSize);
    ctx.stroke();
}

// Helper function to get grid cell from mouse position
function getCellPosition(event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / cellSize);
    const y = Math.floor((event.clientY - rect.top) / cellSize);
    return { x, y };
}


function updateCell(x, y, color) {
    // Guard: Ensure coordinates are within bounds
    if (x < 0 || y < 0 || x >= gridSize || y >= gridSize) return;

    // Update the grid state
    gridState[y][x] = color === 'black' ? 0 : 1;

    // Variables for drawing
    const frac = 0.9; // Fraction of cell size
    const offset = (1 - frac) * cellSize / 2; // Centering offset

    // Fill the cell on canvas
    ctx.fillStyle = color;
    ctx.fillRect(
        x * cellSize + offset,
        y * cellSize + offset,
        cellSize * frac,
        cellSize * frac
    );
}

function drawCell(x, y, color) {
    if (color === 'black') {
        // Update and fill surrounding cells (3x3 grid)
        for (let dx = 0; dx <= 1; dx++) {
            for (let dy = 0; dy <= 1; dy++) {
                updateCell(x + dx, y + dy, color);
            }
        }
		// updateCell(x, y, color);
    } else if (color === 'white') {
        // Update and fill only the center cell
        updateCell(x, y, color);
    }
}

// Function to submit the grid state to "/calculate"
function submitGrid() {
    // Prepare the grid state as JSON
    const payload = { grid: gridState };

    // Send a POST request
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
        })
        .then((data) => {
            updateGraph(data['output']); // Pass response to handler
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// function updateGraph(data) {
// 	if (plot) {
// 		const layout = plot.layout;
// 		const dataUpdate = [{
// 			x: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
// 			y: data,
// 			type: 'bar',
// 		}];
// 		Plotly.react('histogram', dataUpdate, layout);
// 	} else {
// 		console.error("Graph not initialized");
// 	}
// }





function updateGraph(data) {
	console.log(data);
    if (plot) {
        // Explicitly define the layout with tickmode and tickvals
        const layout = {
            title: 'Histogram',
			xaxis: {
				title: 'X-Axis',
				tickmode: 'array', // Explicitly set tick mode to array
				tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // Explicitly define the ticks
			},
			yaxis: {
				title: 'Y-Axis',
			}
        };
        
        const dataUpdate = [{
            x: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            y: data,
            type: 'bar',
        }];
        
        // Update the graph with new data and the modified layout
        Plotly.react('histogram', dataUpdate, layout);
    } else {
        console.error("Graph not initialized");
    }
}







// Attach the submitGrid function to the button
document.getElementById('submit-grid').addEventListener('click', submitGrid);


// Event listeners for drawing
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const { x, y } = getCellPosition(e);
    const color = tool === 'pen' ? 'black' : 'white';
    drawCell(x, y, color);
});	

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        const { x, y } = getCellPosition(e);
        const color = tool === 'pen' ? 'black' : 'white';
        drawCell(x, y, color);
    }
});

canvas.addEventListener('mouseup', () => (drawing = false));
canvas.addEventListener('mouseleave', () => (drawing = false));

// Touch events for mobile devices
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    drawing = true;
    const touch = e.touches[0];
    const { x, y } = getCellPosition(touch);
    const color = tool === 'pen' ? 'black' : 'white';
    drawCell(x, y, color);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (drawing) {
        const touch = e.touches[0];
        const { x, y } = getCellPosition(touch);
        const color = tool === 'pen' ? 'black' : 'white';
        drawCell(x, y, color);
    }
});

canvas.addEventListener('touchend', () => (drawing = false));
canvas.addEventListener('touchcancel', () => (drawing = false));

// Tool buttons
document.getElementById('pen-tool').addEventListener('click', () => {
    tool = 'pen';
    document.getElementById('pen-tool').classList.add('btn-primary');
    document.getElementById('pen-tool').classList.remove('btn-secondary');
    document.getElementById('eraser-tool').classList.add('btn-secondary');
    document.getElementById('eraser-tool').classList.remove('btn-primary');
});

document.getElementById('eraser-tool').addEventListener('click', () => {
    tool = 'eraser';
    document.getElementById('eraser-tool').classList.add('btn-primary');
    document.getElementById('eraser-tool').classList.remove('btn-secondary');
    document.getElementById('pen-tool').classList.add('btn-secondary');
    document.getElementById('pen-tool').classList.remove('btn-primary');
});


document.addEventListener("DOMContentLoaded", function() {
	plot = Plotly.newPlot('histogram', [{
		x: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
		y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		type: 'bar',
	}], {
		title: 'Histogram',
		xaxis: {
			title: 'X-Axis',
			tickmode: 'array', // Explicitly set tick mode to array
			tickvals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] // Explicitly define the ticks
		},
		yaxis: {
			title: 'Y-Axis',
		}
	});
});