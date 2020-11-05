<img src="images/kanbanignore.png" alt="kanbanignore" style="zoom: 33%;" />



This repository contains my Udacity Cloud Developler capstone project. In the following I will give you some information and remarks on setting up the project. 

### client-app

![client-app](images/client-app.png)

The client app (/client-app) is written in angular and uses the angular material ui framework. The authentication is done via Auth0 and you can login using e.g. your gmail account. 

#### setting up the client-app

- **Auth0**: in case you are using your own Auth0 authentication, please adapt the variables in the file client-app/src/assets/config/auth-config.json:

```json
 {
   domain: ""
   clientId: ""
 } 
```

- Update the api endpoint url according to the 

```yaml
apiEndpoint: 'https://$$api-gateway-id$$.execute-api.eu-west-1.amazonaws.com/dev'
```



### serverless backend

to to the **serverless.yml** file in /backend and edit the following variables:

```yaml
stage: ${opt:stage, 'dev'} # the environmet you choose to deploy
region: ${opt:region, 'eu-west-1'} # your region

environment:
	S3_BUCKET: # unique name of the bucket used for image upload
	AUTHID: # authID of your application
```

deploy your serverless application:

```bash
sls deploy -v
```



### short video of the running application

you can find it in: **images/kanbanignore.mp4**

<video src="images/kanbanignore.mp4"></video>