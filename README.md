In order to utilise this package you will need to create .env files that access the data in use.
There should comprise of two .env files named;
.env.test
.env.development

test should contain;
PGDATABASE=test_database_name_here

and development;
PGDATABASE=development_database_name_here

These should be ignored by default with the .gitignore that is included in the package. This can be checked, the .gitignore file should include the following line;
.env.*

