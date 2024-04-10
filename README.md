## Wallet Scan Web Application 

### Development Setup
Frontend: React, Javascript 

Backend: Spring Boot, Java

Database: MySQL

API: 
+ OCR API for image recognition
+ Cloudinary API for image upload and image url generation

Figma reference: [Link](https://www.figma.com/file/oRBFmCwK1fX05q8CBdxVXx/Wallet-Scan?type=design&node-id=0%3A1&mode=design&t=2X33eunXWXTEsIme-1)

### How to run [Local]
Run WalletscanApplication.java for backend. 

cd frontend/ -> run `npm start` to open frontend. 

Can review the application on http://localhost:3000

### How to test

+ test frontend using Jest
  - cd frontend/
  - run `npm test` to run test cases.
  - run `npm run coverage` to run all the test cases with coverage
    
    <img width="392" alt="Screenshot 2024-04-09 212053" src="https://github.com/jackiezzz24/WalletScan/assets/99145834/0b35246e-7284-4392-83d6-cd6d68e5368c">
+ test backend using JUnit
  
  All the test cases saved in the src/test folder.
  
  You can check the coverage report in htmlReport/index.html
  
  <img alt="Screenshot 2024-04-08 220613" src="https://github.com/jackiezzz24/WalletScan/assets/99145834/8bea2cd7-40aa-4ffd-9474-07f4fadc278b">

### Deployment on AWS

http://walletscan.s3-website.us-east-2.amazonaws.com/

