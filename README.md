# MetaNexus

## Overview
MetaNexus is a **Metastore Viewer** that extracts and visualizes metadata from cloud storage services like **AWS S3* without requiring an external metastore. It supports **Parquet, Iceberg, Delta** table formats.

## Features
- **User Signup & IAM Role-Based Access**: Users create an ARN code and grant IAM role access for seamless integration.
- **S3 Bucket Management**: Users can add S3 buckets to fetch metadata.
- **Metadata Visualization**: Row count, size, partition key, schema, and more displayed in graphical format.
- **AI Chatbot**: Assists users with metadata queries.
- **Summary Reports & Data-Driven Insights**: Provides structured reports on data patterns.
- **Multi Format Compatibility**: Supports Delta, Iceberg and Parquet.

## Flow Diagram
The platform follows this flow:
1. **User Signup & IAM Role Access**
2. **Login & Add Amazon S3 Buckets**
3. **Redirect to Bucket-Specific Dashboard**
4. **View Metadata Insights (Graphical Representation)**
5. **Interact with AI Chatbot for Assistance**
6. **Access Summary Reports & Data-Driven Insights**

## Tech Stack
- **Frontend**: React.js, Typescript, Next.js
- **Backend**: Python, Flask 
- **Cloud Services**: AWS S3
- **AI & Automation**: Mystral AI by Ollama

## Installation & Setup
```sh
# Clone the repository
git clone https://github.com/yourusername/MetaNexus.git
cd MetaNexus

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install

# Start the backend server
cd ../backend
uvicorn main:app --reload

# Start the frontend
cd ../frontend
npm start
```

## Contributing
We welcome contributions! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Added a new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.


## Contact
For queries or support, reach out to **rugvedi.n20@gmail.com** or open an issue in the repository.

---

### **Star ⭐ this repository if you find it useful!**
