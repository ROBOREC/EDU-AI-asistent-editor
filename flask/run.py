import os
from app import app, db

app.run("0.0.0.0", port=os.getenv("APP_PORT"), debug=os.getenv("DEBUG"))
