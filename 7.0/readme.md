### About Version 7.0 :round_pushpin:
This version was created for the resolution of [desafio 10](https://github.com/rocketseat-education/bootcamp-launchbase-desafios-10/blob/master/desafios/10-sistema-login-foodfy.md) from Launchbase bootcamp.

In this challenge we created a login system for the foodfy admnistration page. Now, the system must have at least an admin user. Only the admin can create chefs and edit his user or other users informations,also is only an Admin who can create new users. Any user can create a new recipe, but a user can manage only his own recipes. We also implemented a forgot-password method that sents a token to the user's email asking for password change and a password is sent to the user's email when he is created.
<br><br/>

I've also added delete cascade to simplify deletion methods

<br><br/>
### Technologies :computer:

+ HTML
+ CSS
+ Javascript
+ Node.Js
  + Express
  + Nunjucks
  + Nodemon
  + Browser Sync
  + Method Override
  + Multer
  + Node Mailer
  + Bcrypt
+ PostgreSQL
+ MailTrap (for checking the necessary emails)
<br><br/>
### How to open :clipboard:
Create proper Postgres Database, then:
use the terminal to enter in 6.0 folder and write the following commands:
  + npm install (wait the installation to finish)
  + npm start
<br></br>
Now, force the creation of an admin user and create a forgot-password ticket for him. After login you can admnistrate the system with admin powers.