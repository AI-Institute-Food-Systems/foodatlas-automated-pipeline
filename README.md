# FoodAtlas Automated Pipeline

This project contains the automated data collection pipeline for the FoodAtlas knowledge graph and website database. It uses AWS Lambda functions to periodically scrape and validate food-related research papers. For more detailed information, see the following Google Doc: https://docs.google.com/document/d/1ufvPYlC58SatOJsQlZsGGuiJxfpYauicruGz-gq2LdY/edit?usp=sharing or contact Lukas (lmasopust@ucdavis.edu).

## Architecture

The pipeline consists of the following AWS resources defined in `template.yaml`:

- `ScrapePaperFunction`: A Lambda function that runs periodically to scrape new research papers; All scraping code is from Fang's (fzli@ucdavis.edu) local FoodAtlas pipeline found here: TODO

  - Triggered on the 1st of every month at midnight via CloudWatch Events
  - Has permissions to write to the S3 bucket `foodatlas-scrape-bucket`
  - Built with esbuild for optimal performance

- `ListUnverifiedFunction`: A Lambda function to list papers from the S3 bucket pending verification

The application uses Node.js 20 runtime and is configured for x86_64 architecture with active tracing enabled.

## Prerequisites

To deploy and work with this application, you need:

- SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Node.js 20 or later - [Install Node.js](https://nodejs.org/en/)
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

## Deployment

Deploy the application using the SAM CLI with the npm scripts defined in package.json. All resources are being deployed under the AIFS root account with username aifs@ucdavis.edu.
