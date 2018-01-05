# egarage
An ERP tool for motor garage automation system.

## Server Installation:
Download XAMPP 5.6.24 from the below link.
https://sourceforge.net/projects/xampp/files/XAMPP%20Windows/5.6.24/

Install the downloaded file by following the on-screen instructions.
Select *show icon on desktop* option, so that it could be easily started before starting the app.
Once installed, double click on XAMPP icon, which starts the server, only then app will run.
To check the server status, Goto http://localhost which displays the XAMPP dashboard.

## Database Setup:
Goto http://localhost/phpmyadmin/ which displays the default databases.
To create a database for the application,
Goto *Databases* tab, enter the *Database name* in *Create database* option, for ex: `egarage`
and click on Create.

Once created, click on the *Database name* i.e. `egarage`, so that the Database gets selected
for import.<br />
Click on *Import*.<br />
Click on *Chose File* and browse the file *C:\xampp\htdocs\egarage\db\egarage.sql* and click on *Go* at the bottom of page.<br />
This takes few minutes and once completed list of tables could be found in egarage database.<br />
This completes the Database Setup.

## Project Installation:
Unzip the project folder ie, egarage.zip at *C:\xampp\htdocs*.
So that for instance a file in it looks like below.
*C:\xampp\htdocs\egarage\index.html*

Open *C:\xampp\php\php.ini* file in an editor.
Replace `upload_max_filesize=2M` with `upload_max_filesize=10M` at line number 809
This allows file uploads of maximum size 10MB.

Open *C:\xampp\htdocs\egarage\assets\script\conf.php* file in an editor.
Ane make sure the below are set.

**Syntax:**

`mysql_connect("<localhost>", "<mysql_username>", "<mysql_password>") or
die(mysql_error());`
`mysql_select_db("<database_name>") or die(mysql_error());`

And the values will be as below.

"&lt;localhost&gt;": `"localhost"`<br />
"<mysql_username>": `"root"`<br />
"<mysql_password>": `"password"`<br />
(if given mysql password while installing XAMPP otherwise just empty string ie, `“”`)
"<database_name>": `"egarage"` (as given in Database Installation)
  
After above are set it looks like below (provided mysql credentials as root and no password)

`mysql_connect("localhost", "root", "") or die(mysql_error());
mysql_select_db("egarage") or die(mysql_error());`

With the above the project installation is completed.

Goto http://localhost/egarage/
This will land the application **eGarage v1.0**

To run the application make sure the XAMPP is running as described in Server Installation.
<br />
> Install the fonts *segoi\*.\** stored at *C:\xampp\htdocs\egarage\assets\fonts\* for better UI.
<br />
