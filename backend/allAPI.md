# Express Routers

## AuthRouter
- POST /user/signin
- POST /user/login
- POST /user/logout

## ProfileRouter
- GET /user/profile/view
- PATCH /user/profile/edit
- PATCH /user/profile/editpassword

## UserRequestForConnectionRouter
- POST /user/request/interested/:user_id
- POST /user/request/ignored/:user_id

- POST /user/request/review/accepted/:request_id
- POST /user/request/review/rejected/:request_id

## userRouter

- GET /user/view/requests
- GET /user/view/connections
- GET /user/view/feed

status:ignored,interested,accepted,rejected
