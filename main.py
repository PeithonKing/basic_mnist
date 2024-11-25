from flask import Flask, render_template, request
import torch
import torch.nn as nn

torch.set_printoptions(linewidth=120)

class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 2, kernel_size=3, stride=1, padding=1)
        self.relu1 = nn.ReLU()
        self.pool1 = nn.MaxPool2d(kernel_size=2, stride=2)

        self.conv2 = nn.Conv2d(2, 4, kernel_size=3, stride=1, padding=1)
        self.relu2 = nn.ReLU()
        self.pool2 = nn.MaxPool2d(kernel_size=2, stride=2)

        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(7*7*4, 100)
        self.relu3 = nn.ReLU()
        self.fc2 = nn.Linear(100, 10)

    def forward(self, x):
        x = self.conv1(x)
        x = self.relu1(x)
        x = self.pool1(x)  # 28x28 -> 14x14

        x = self.conv2(x)
        x = self.relu2(x)
        x = self.pool2(x)  # 14x14 -> 7x7
        
        x = self.flatten(x)
        x = self.fc1(x)
        x = self.relu3(x)
        x = self.fc2(x)
        return x

model = torch.load('model.pth', map_location=torch.device('cpu'))["model"]
model.eval()

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = 1 - torch.Tensor(request.json['grid'])
    output = model(data.unsqueeze(0).unsqueeze(0))
    output = torch.softmax(output, dim=1).detach().numpy().flatten()
    return {'output': output.tolist()}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
