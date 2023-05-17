Backend for *Stevens Fit* Web Application!

## Swagger Docs
You can use Swagger Docs to learn about and test the API. Swagger provides a user interface for API documentation called Swagger UI, which can be accessed through a web browser.

To access Swagger Docs for Stevens Fit API, go to [localhost:3000/api-docs/](http://localhost:3000/api-docs/). 

## Installation
```
git clone https://github.com/ayadav313/stevens-fit-backend.git
cd stevens-fit-backend
```
## Install dependencies
```
npm i
```
## Seed 'Exercise' data from data.csv downloaded from [www.kaggle.com/datasets](https://www.kaggle.com/datasets/edoardoba/fitness-exercises-with-animations?resource=download)
```
npm run seed
```
## To start the application in development mode, run the following command:
```
npm run dev
```
The application will start at http://localhost:3000 and will automatically reload when changes are made to the code.

## Test MongoConnection
```
npm run test:mongo
```
## Test Data layer
```
npm run test:data
```
