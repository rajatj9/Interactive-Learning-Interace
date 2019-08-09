# Getting Interested Mobile Web Application

This application is developing based on **vue.js**(vue cli 3) and **d3.js**(v4). 
There are 4 stages in this app: auth to the Data Center(the back-end), answer the questions of the survey, 
preview the answers before submit, and get response from the backend. 

## Installation and Configuration
To run the GI frontend client on its own:

```shell
# clone the repo
git clone https://git.teli.hku.hk/getting-interested-project/Getting_Interested_Frontend
# install dependencies
npm install
# copy .env to .env.local
cp .env .env.local
# compiles and hot-reloads for development
npm run serve
```

Optional Commands:
```shell
# Compiles and minifies for production
npm run build
# Output folder: `frontend`

# Run your tests
npm run test

# Lints and fixes files
npm run lint
```

Customize configuration:
See [Configuration Reference](https://cli.vuejs.org/config/).



## Project Structure

```
├── public/                     # pure static assets (directly copied)
│   ├── icon_GI.png
│   ├── ...   
│   └── index.html              # index.html template    
├── src/
│   ├── main.js                 # app entry file
│   ├── routes.js               # app route file
│   ├── App.vue                 # main app component
│   ├── assets/                 # module assets (processed by webpack)
│   │   └── ...
│   ├── components/             # ui components
│   │   └── ...
│   ├── constants/              # app constant variables
│   │   └── ...
│   ├── mixins/                 # mixins for ui components
│   │   ├── authForm.js         # auth form
│   │   ├── inputScale.js       # scale define for question and answer  
│   │   ├── questionText.js     # text value for question and answer 
│   │   ├── skechPad.js         # svg difine 
│   │   └── touchTips.js        # touch tips display before touch svg
│   ├── store/                  # vuex store
│   │   └── ...
│   ├── utiljs/                 # util function
│   │   └── ...
│   └── views/ 
│       ├── Auth.vue            # authorization view
│       ├── Error.vue           # 404 
│       ├── Home.vue            # default view for the app (contains a logo)
│       ├── Overview.vue        # display all answers
│       ├── QRcode.vue          # QRcode for non-mobile device
│       ├── Survey.vue          # carousel view for questions 
│       └── Thankyou.vue        # response after successful submit
├── .env                        # environment variables
├── .gitignore                  # sensible defaults for gitignore
├── aliases.config.js           # aliases config
├── babel.config.js             # babel config
├── vue.config.js               # main project config
├── package-lock.json           # NPM package lock
├── package.json                # build scripts and dependencies
└── README.md                   # Default README file 
```


## Backend Api

This sections describes the api provided by the backend. The data structures of both request and response will be illustrated below.

### Sign Up
The app will send the username and survey token to the backend. If the user can sign up successfully, the backend will return back a list of the question. Otherwise, it will return back some warning message.

api: `/signUp`

request data structure:
- username(string)
- survey_token(string)
- survey_group_id(string): optional, it will be needed if frontend get parameter survey_group_id in survey page

response data structure:
- questions(array): a list of questions
- survey_token(string)
- survey_name(string)
- message_id(int)
- message(string)

data structure of question in response:
- question_id(int)
- sequence(int)
- title(string): text of the question
- input_mode_id(int): the id of input methods: Likert, Swipe, Slider, Tap, etc
- scale_id(int)
- scale_unit(array): a list of scale (which can be treat as options, descriptions)
- title_image(image url): if need, only Multiple choice and image choice have this attribute


data structure of scale_unit in response:
- sequence(int): can be treated as id
- title(string): the text of scale (description)
- value(number)

The message id/code are list as below: 
(Since the backend didn't group the messages into general app message id, this app need to match the message for each api)
1. Username is registered
2. Username registration fail
3. Invalid survey token
4. This username has been taken. Please use another one.


### Sign In
The app will to sign in the system with username and survey token.  If the user can login successfully, the backend will return back a list of the question. Otherwise, it will return back some warning message.

api: `/signIn`

request data structure: 
(same as `/signUp`)

response data structure:
(same as `/signUp`)

The message id/code in this api:
1. Survey is available
2. Survey has been completed
3. Invalid survey token
4. You are not registered. Please sign up first.

### Submit Answer

The app submit all the answers and related information (including user operations of each input methods) to the backend. Afterwards, the backend return response message.

api: `/submitAnswer`


#### Request Data Structure of Submit Answer
request data structure: 
- username(string)
- survey_token(string)
- survey_group_id(string): optional
- survey_start_time(date ISO string): the time that it receive questions from the backend (format example: 2018-07-20T10:38:21.449Z)
- survey_end_time(date ISO string): the time that it start submitting the answer to the backend
- answers(array): a list of answer

The answer data structure of different input methods will be illustrated as below.
 
##### Likert(Multiple Choice) Answer 
- question_id(int)
- value(int): it should be selected option's sequence id in the scale
- answer_time(list): a list of answer time
- operations(list): a list of Likert operation

answer time data structure:
- start_time(Date LocaleTimeString): the time start to display the question (format example: 16:34:31)
- end_time(Date LocaleTimeString): the time move to next question  

data structure of Likert operation:
- time(Date LocaleTimeString): the time that user select an option
- value(int): selected scale sequence

##### Swipe / Minor Swipe Answer
- question_id(int)
- value(float): interpolation float value based on the question scale's values
- answer_time(list): a list of answer time
- operations(list): a list of Swipe operation

data structure of Swipe operation:
- start_value(float): the visual value that touchstart  
- start_time(Date LocaleTimeString): the time value that touchstart 
- start_position([x, y]): the touchstart point's coordinate 
- end_value(float): the visual value that touchend
- end_time(Date LocaleTimeString): the time value that touchend
- end_position([x, y]): the touchend point's coordinate
- track([x, y, z]): a list of coordinates
    - x(float): x coordinate
    - y(float): y coordinate
    - z(int): millisecond related to last position
    

##### Slider Answer
- question_id(int)
- value(float)
- answer_time(list): a list of answer time
- operations(list): a list of Slider operation

data structure of Slider operation:

There are two type of operation: drag and click.

drag:
- type(string): should be "drag"
- start_value(float): the visual value that touchstart  
- start_time(Date LocaleTimeString): the time value that touchstart 
- start_position([x, y]): the touchstart point's coordinate 
- end_value(float): the visual value that touchend
- end_time(Date LocaleTimeString): the time value that touchend
- end_position([x, y]): the touchend point's coordinate
- track([x, y, z]): a list of coordinates
    - x(float): x coordinate
    - y(float): y coordinate
    - z(int): millisecond related to last position

click:
- type(string): should be "click"
- value(float): selected value
- time(Date LocaleTimeString): the time value that click the slider
- position([x, y]): the click point's coordinate


##### Image Choice Answer
- question_id(int)
- value(int): it should be selected option's sequence id in the scale 
- answer_time(list): a list of answer time
- operations(list): a list of Likert operation 
 
#### Text Box Answer
- question_id(int)
- value(string): less than 500 characters
- answer_time(list): a list of answer time

#### Elastic Pull Answer
- question_id(int)
- value(float): interpolation float value based on the question scale's values
- answer_time(list): a list of answer time
- operations(list): a list of Elastic Pull operation

data structure of Swipe operation:
- action(string): "pull" or "push"
- start_value(float): the visual value that touchstart  
- start_time(Date LocaleTimeString): the time value that touchstart 
- start_position([x, y]): the touchstart point's coordinate 
- end_value(float): the visual value that touchend
- end_time(Date LocaleTimeString): the time value that touchend
- end_position([x, y]): the touchend point's coordinate
- stop_value(float): the visual value that indicator stopped
- stop_time(Date LocaleTimeString): the time value that that indicator stopped
- stop_position([x, y]): coordinate of the position that that indicator stopped
- track([x, y, z]): a list of coordinates
    - x(float): x coordinate
    - y(float): y coordinate
    - z(int): millisecond related to last position
 
#### Response Data Structure of Submit Answer
response data structure:
- message_id(int)
- message(string)

The message id/code in this api:
1. Answer successfully submitted
2. Answer failed to be submitted
3. Invalid survey token
4. Invalid username

### QR code
If the user doesn't use mobile device, the app will get the QR code data from the backend and display it instead of showing questions so that it can force the user use mobile device to answer questions. 

api: `/getQrCode`

request data structure: 
- survey_token(string)

response data structure:
- message_id(int)
- message(string)
- surveyQRCodeUrl(string): QR code data with base64 format

The message id/code in this api:
1. Valid survey token: A QR code will be displayed in the survey stage
2. Invalid survey token: A 404 message will be shown in the survey stage