## Wallet Scan Web Application 

### Development Setup
Frontend: React, Javascript 

Backend: Spring Boot, Java

Database: MySQL

API: 
+ OCR API for image recognition
+ Cloudinary API for image upload and image url generation

Figma reference: [Link](https://www.figma.com/file/oRBFmCwK1fX05q8CBdxVXx/Wallet-Scan?type=design&node-id=0%3A1&mode=design&t=2X33eunXWXTEsIme-1)

### How to run 
Run WalletscanApplication.java for backend. 

cd frontend/ -> run `npm start` to open frontend. 

Can review the application on http://localhost:3000

### JEST
To install react-testing-library and jest-dom, you can run:
npm install --save @testing-library/react @testing-library/jest-dom
npm install @testing-library/user-event @testing-library/dom --save-dev


Run
确保你在项目的根目录中运行npm test命令。你应该在包含package.json文件的同一目录级别运行此命令。
