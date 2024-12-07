#!/bin/bash

# Set the project root directory
PROJECT_ROOT="backend"

# Create the main project directory
mkdir -p $PROJECT_ROOT

# Navigate into the project directory
cd $PROJECT_ROOT || exit

# Create the application directory structure
mkdir -p app/{api/{v1/endpoints},core,models,schemas,utils}
touch app/{__init__.py,main.py}
touch app/api/{__init__.py,v1/__init__.py,endpoints/__init__.py}
touch app/core/__init__.py
touch app/models/__init__.py
touch app/schemas/__init__.py
touch app/utils/__init__.py

# Create a sample main.py file with a basic FastAPI application
cat <<EOL > app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}
EOL

# Create a requirements.txt file with FastAPI and Uvicorn
cat <<EOL > requirements.txt
fastapi
uvicorn
EOL

# Create a .gitignore file to exclude unnecessary files
cat <<EOL > .gitignore
__pycache__/
*.py[cod]
venv/
.env
EOL

# Navigate back to the project root
cd ..

# Display the created directory structure
echo "Backend structure created successfully:"
tree $PROJECT_ROOT
