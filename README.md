# MNIST Handwriting Recognizer Demo  

This project is a Flask-powered web app designed as a fun and interactive demonstration of machine learning concepts, perfect for an audience with little to no experience in ML. Originally created for a 9th-semester MSc Physics thesis presentation, it serves as both an engaging teaching tool and an excellent toy problem for those wanting to explore machine learning and PyTorch. Whether you're an expert introducing ML to beginners or a curious learner starting out with PyTorch, this project offers a hands-on way to dive into the fundamentals.  

## Features  
- **Interactive Canvas**: Draw a digit (0–9) on the canvas and submit it using the "Submit Grid" button to see predictions.  
- **Digit Prediction**: A trained CNN model processes the input and displays a histogram of the prediction probabilities, making the ML process visual and easy to grasp.  
- **Out-of-the-Box Functionality**: A pre-trained model is included, so you can immediately start experimenting without needing to train from scratch.  
- **Perfect for Learning**: A great first project for anyone interested in learning how to use PyTorch while solving a classic ML problem.  
- **Audience-Friendly**: Specifically designed to make ML approachable and engaging, ideal for demonstrations by experts to non-expert audiences.  


## Installation and Usage

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/PeithonKing/basic_mnist.git
   cd basic_mnist
   ```

2. **Install Dependencies**:
   Set up a virtual environment and install the required Python packages:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Run the Server**:
   Start the Flask app:
   ```bash
   python main.py
   ```
   The app will be accessible at `http://localhost:5050/`.

4. **Use the App**:
   - Open the app in your browser.
   - Draw a digit on the canvas, click "Submit Grid," and view the model’s prediction as a histogram.

## Training the Model

### Dataset
The model is trained on the **MNIST dataset** provided by `torchvision`. This dataset contains 28x28 grayscale images of handwritten digits (0–9).

### Model Architecture
The CNN model is designed for simplicity and interpretability:
1. **Input Processing**: Takes 28x28 grayscale images.
2. **Convolutional Layers**:
   - **First Layer**:
     - Convolution with 3x3 kernels, stride 1, and maps input to 4 channels.
     - ReLU activation.
     - 2x2 max pooling reduces dimensions to 14x14.
   - **Second Layer**:
     - Convolution with 3x3 kernels, stride 1, and maps to 16 channels.
     - ReLU activation.
     - 2x2 max pooling reduces dimensions to 7x7.
3. **Fully Connected Layers**:
   - Flattened output is passed to a 3-layer MLP.
   - First layer has 100 hidden neurons and ReLU activation.
   - Final layer maps to 10 output classes (digits 0–9).

### Data Augmentation
The training process includes transformations to improve robustness of the hanswriten digit recognition task:
- Random affine transformations:
  - Rotation (±15 degree)
  - Translation (up to 20%)
  - Scaling (0.5x to 1.2x).
- Random inversion of colors (black character in white and white character in black)

### Optimization
- **Optimizer**: Adam (lr=1e-2, weight_decay=1e-5)
- **Loss Function**: Cross-Entropy Loss
