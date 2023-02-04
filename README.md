# gentscup

[In development]
An application to help manage a golf tournament.
Repository currently holds Flask API and React front end.
Built using AWS Cognito and Postgres.

## Steps for running

#### Make sure postgres is installed:
`brew install postgresql`

#### Create virtual environment:
`python3 -m venv venv`

#### Run virtual environment:
`. venv/bin/activate`

#### Install required packages:
`pip3 install -r requirements.txt`

#### Running Flask API:
`Flask—app src/main —debug run`

#### Running React SPA:
Navigate to /src/web & `run npm start`
