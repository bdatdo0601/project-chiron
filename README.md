## Requirements
- Front-end:
  - Node (> v14) (Recommend to use a node version manager like [n](https://github.com/tj/n) or [nvm](https://github.com/nvm-sh/nvm))
  - [Yarn Package Manager](https://yarnpkg.com/)
- Back-end:
  - [Amplify CLI](https://docs.amplify.aws/cli/)
  - [AWS Account](https://aws.amazon.com/) (can also ask Owner if you don't want to create one)

## Setting Up

### Install necessary dependencies
```
cd project-chiron/
yarn install
```

This project's infrastructure relied on AWS Amplify, which allow you to orchestrate AWS resources (to host, back-end, CDN, etc) and connect them with a web application.

AWS resource code and definition is stored in `amplify/` directory. Amplify also allow multiple environments (such as dev, prod, staging, custom, etc)

To connect with a web application, Amplify, particularly Amplify CLI, will generate `aws-exports.js` file to webapp `src/` directory. The file will be based off `amplify/`

### If you just want to run the Web-Application
- Download this file `aws-exports.js` (https://drive.google.com/file/d/19oMX7bwKRe624QeRHaw6gYA5c6rxVNT-/view?usp=sharing) and copy it to `src/aws-exports.js`. This file is generated directly from the dev environment

### If you want to have the ability to change the Back-end
1. Acquire `AWS_ACCESS_KEY` and `AWS_SECRET_KEY`. This either come from the owner or your own AWS account. Either way, this needs to have `AmplifyAdministratorAccess`
2. Run `amplify configure` and follow instruction to connect to the account
3. Run `amplify init` and follow instruction to generate `aws-exports.js`
   1. It is recommended to create your own Amplify environment, so back-end changes won't be conflict if we build things in parallel
   2. If you create your own Amplify environment, run `Amplify push` to deploy your back-end for the first time

### Finally to run the application
```
yarn start
```
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
### `yarn serve`

Serving bundled package, used to test production build.

## Folder Structure

```
.
├── _layouts
├── amplify                                         # All AWS Related Resources
│   └── backend
│       ├── analytics
│       ├── api
│       ├── auth
│       ├── awscloudformation
│       ├── function
│       ├── hosting
│       ├── notifications
│       └── storage
├── public                                          # Static meta files for main web app
└── src                                             # Main Web Application (CRA)
    ├── __tests__                                   # Testing suite
    ├── assets                                      # Static Assets
    ├── components                                  # Reusable Components
    ├── containers                                  # Each separate pages
    ├── context                                     # Data Context
    ├── graphql                                     # GraphQL Queries/Mutations (auto-generated)
    ├── layout                                      # Shared Layout
    └── utils                                       # Utilities/Helpers
```