# Natours
| | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|info| | | | |item| | | | | | | | | | | | | | | | | | | | | | | | | |
|_postman_id|name|description|schema|_exporter_id|name|item| | | | | | | | | | | | | | | | | | | | | | | |description|
| | | | | | |name|request| | | | | | | | | | | | | | | | | | |response|event| | | |
| | | | | | | |auth| | | |method|header| | | |url| | |description|body| | | | | | |listen|script| | |
| | | | | | | |type|bearer| | | |key|value|type|disabled|raw|host|path| |mode|raw|options|formdata| | | | |exec|type| |
| | | | | | | | |key|value|type| | | | | | | | | | | |raw|key|type|src| | | | | |
| | | | | | | | | | | | | | | | | | | | | | |language| | | | | | | | |
|024d1984-c14b-4649-a0ff-0ff1fce74891|Natours|This is an **API** created with **Node, Express** and **MongoDB**. It performs the basic **CRUD** operations along with **User Authorization** and **Authentication.**|https://schema.getpostman.com/json/collection/v2.1.0/collection.json|19327407|Tours|Get All Tours|noauth| | | |GET|||text|TRUE|{{URL}}api/v1/tours/|{{URL}}api|v1|This is an endpoint for getting all tours.| | | | | | | | | | |You can **CREATE**, **GET**, **UPDATE** and **DELETE** tours by using the endpoints in this folder.|
| | | | | |Users|Get all users|bearer|token|{{JWT}}|string|GET| | | | |{{URL}}api/v1/users/|{{URL}}api|v1|This endpoint is used by an _admin_ to **GET** all users from the database.|raw| {     "name": "Test",     "duration": 5,     "maxGroupSize": 25,     "difficulty": "easy",     "ratingsAverage": 4.7,     "ratingsQuantity": 37,     "price": 397,     "summary": "Breathtaking test",     "description": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",     "imageCover": "tour-1-cover.jpg",     "images": ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],     "startDates": ["2021-04-25,10:00", "2021-07-20,10:00", "2021-10-05,10:00"],     "secretTour": true   }|json| | | | | | | |You can **CREATE**, **GET**, **UPDATE, DEACTIVATE** and **DELETE** users by using the endpoints in this folder.|
| | | | | |Authentication|signup|bearer|token|{{JWT}}|string|POST| | | | |{{URL}}api/v1/users/signup|{{URL}}api|v1|This endpoint is for users to **SIGNUP** i.e **CREATE** an account.|raw|{     "name":"Yui Chan",     "email": "yui@example.com",     "password": "{{password}}",     "passwordConfirm": "{{password}}"  }|json|photo|file|/home/morizuq/Pictures/Wallpapers/a466.jpg| |test|pm.environment.set("JWT", pm.response.json().token);|text/javascript|Users can **SIGNUP**, **LOGIN**, **FORGET PASSWORD**, **RESET PASSWORD** and **UPDATE PASSWORD** by using the endpoints in this folder.|
| | | | | |Reviews|Get All Reviews|bearer|token|{{JWT}}|string|GET| | | | |{{URL}}api/v1/reviews/|{{URL}}api|v1|This endpoint is for **GETTING** all reviews|raw|{     "email": "admin@mori.io",     "password":"{{password}}" }|json| | | | |test|pm.environment.set("JWT", pm.response.json().token);|text/javascript|You can **CREATE**, **GET**, **UPDATE** and **DELETE** reviews by using the endpoints in this folder.|
| | | | | |Tour/Review|Create review from tour|bearer|token|{{JWT}}|string|POST| | | | |{{URL}}api/v1/tours/5c88fa8cf4afda39709c295a/reviews|{{URL}}api|v1|This endpoint accepts a _tour id_ as params and it is for **CREATING** a review on a tour by a logged in user.|raw|{     "review": "Was a great one, had fun",     "rating": 4 }|json| | | | | | | | |
| | | | | | |Get Review|bearer|token|{{JWT}}|string|GET| | | | |{{URL}}api/v1/reviews/6332cb9d898dab096d6abce8|{{URL}}api|tours|This endpoint is for **GETTING** a review by its _id._|raw|{     "password" : "test1234",     "passwordConfirm": "test1234" }|json| | | | | | | | |
| | | | | | |Delete Review|bearer|token|{{JWT}}|string|DELETE| | | | |{{URL}}api/v1/reviews/633720418557c42fcafc7837|{{URL}}api|5c88fa8cf4afda39709c295a|This endpoint is for **DELETING** reviews by authorized users.|raw|{     "passwordCurrent": "password123",     "password": "password1234",     "passwordConfirm": "password1234"  }|json| | | | |test|pm.environment.set("JWT", pm.response.json().token);|text/javascript| |
| | | | | | |Update Review|bearer|token|{{JWT}}|string|PATCH| | | | |{{URL}}api/v1/reviews/633720418557c42fcafc7837|{{URL}}api|reviews|This endpoint is for **UPDATING** reviews by authorized users.|raw|{     "rating": 5 }|json| | | | | | | | |
| | | | | | | | | | | | | | | | | | |reviews| | | | | | | | | | | | |
| | | | | | | | | | | | | | | | | | |633720418557c42fcafc7837| | | | | | | | | | | | |
| | | | | | | | | | | | | | | | | | |unit| | | | | | | | | | | | |
| | | | | | | | | | | | | | | | | | |mi| | | | | | | | | | | | |
| | | | | | | | | | | | | | | | | | |mi| | | | | | | | | | | | |

![Screenshot from 2022-10-14 12-47-40](https://user-images.githubusercontent.com/67459221/198379477-404416d2-54c1-43c0-bce8-f7cae264214d.png)

![Screenshot from 2022-10-27 20-18-37](https://user-images.githubusercontent.com/67459221/198379492-6c854f4a-7569-4837-a226-5acb35d3c5fc.png)

