FROM softinstigate/serverless

WORKDIR /app

ADD . .

RUN sls dynamodb install